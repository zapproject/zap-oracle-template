pragma solidity ^0.4.24;

//==============================================================================================================
// Dependencies
//==============================================================================================================

contract Token {
    function transfer(address to, uint256 amount) public returns (bool);
    function balanceOf(address addr) public view returns (uint256);
}

contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed previousOwner,address indexed newOwner);

    /// @dev The Ownable constructor sets the original `owner` of the contract to the sender account.
    constructor() public { owner = msg.sender; }

    /// @dev Throws if called by any contract other than latest designated caller
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /// @dev Allows the current owner to transfer control of the contract to a newOwner.
    /// @param newOwner The address to transfer ownership to.
    function transferOwnership(address newOwner) public onlyOwner {
       require(newOwner != address(0));
       emit OwnershipTransferred(owner, newOwner);
       owner = newOwner;
    }
}


contract ZapCoordinatorInterface is Ownable{
    function getContract(string contractName) public view returns (address);
}

interface DispatchInterface {
    function query(address, string, bytes32, bytes32[]) external returns (uint256);
    function cancelQuery(uint256) external;
}

contract ClientIntArray{
    /// @dev callback that provider will call after Dispatch.query() call
    /// @param id request id
    /// @param response int array
    function callback(uint256 id, int[] response) external;
}

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}          

//==============================================================================================================
// Faucet Contract
//==============================================================================================================

contract Faucet is ClientIntArray, Ownable {
    using SafeMath for uint256;

    Token token;
    address public tokenAddress;
    uint public decimals = 10 ** 18;

    address coordAddr;
    ZapCoordinatorInterface coord;

    DispatchInterface dispatch;
 
    // Address of our price feed oracle
    address oracleAddr;

    event Rate(uint256 queryID, uint256 rate);
    event Fulfilled(address client, uint256 eth, uint256 zap);
    event EmptyFaucet(uint256 balance, uint256 required);

    /* Represents one order */
    struct Order {
        address client;
        uint256 eth_amount;
    }

    // mapping of addresses and Ether amounts (wei) to be fulfilled
    mapping(uint256 => Order) private orderBook;

    function refreshDependencies(address newOracle) public onlyOwner {
        oracleAddr = newOracle;
        dispatch = DispatchInterface(coord.getContract("DISPATCH"));
    }

    function withdrawTok() public onlyOwner {
        if (owner != msg.sender) revert();
        token.transfer(owner, token.balanceOf(this));        
    }
    
    function withdrawEther() public onlyOwner {
        if (owner != msg.sender) revert();
        owner.transfer(address(this).balance);
    }   

    constructor(address _coord, address _oracle) public {
        coordAddr = _coord;
        coord = ZapCoordinatorInterface(coordAddr);

        token = Token(coord.getContract("ZAP_TOKEN"));
        dispatch = DispatchInterface(coord.getContract("DISPATCH"));
    }

    function getOrder(uint256 id) public view returns (address, uint256){
        return (orderBook[id].client, orderBook[id].eth_amount);
    }

    /* Payable function that returns an amount of Zap based on the current exchange rate */
    function buyZap() public payable {
        if(msg.value > 0) {
            // query the price oracle
            bytes32[] memory params = new bytes32[](0);
            uint256 id = dispatch.query(oracleAddr, "ETH", "zapprice", params);
            // put the order in the orderbook
            orderBook[id].client = msg.sender;
            orderBook[id].eth_amount = msg.value;
        } else 
            revert();
    }

    // TO DO: SECURE IT!
    /* Called upon the provider fulfilling the query, enabling the faucet to fulfill the buy request */
    function callback(uint256 id, int256[] response) external {
        require(msg.sender == address(dispatch));
        uint256 rate = uint256(response[0]);
        uint256 amount = orderBook[id].eth_amount;
        address client = orderBook[id].client;

        // publish the current exchange rate
        emit Rate(id, rate);
        
        if(orderBook[id].eth_amount == 0) revert();
        
        uint256 weiZap = (amount).mul(rate) / decimals;

        // remove order from orderBook
        orderBook[id].client = 0;
        orderBook[id].eth_amount = 0;

        // if the Faucet is out, return the Eth
        if(weiZap > token.balanceOf(this)){
            emit EmptyFaucet(token.balanceOf(this), weiZap);
            client.transfer(amount);
            return;
        }

        // publish order
        emit Fulfilled(client, amount, weiZap);

        token.transfer(client, weiZap);
    }
}