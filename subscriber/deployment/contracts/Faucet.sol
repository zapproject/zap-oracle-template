pragma solidity ^0.4.24;

import "./dependencies/Client.sol";
import "./dependencies/DispatchInterface.sol";

contract Token {
    function transfer(address to, uint256 amount) public returns (bool);
    function balanceOf(address addr) public view returns (uint256);
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

contract Faucet is ClientBytes32Array {
    using SafeMath for uint256;

    Token token;
    address public owner;
    address public tokenAddress;
    uint public decimals = 10 ** 18;

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

    modifier ownerOnly {
        require(msg.sender == owner); 
        _;
    }

    function setOwner(address _owner) public ownerOnly {
        require(_owner != address(0));
        owner = _owner;
    }
    
    function withdrawTok() public ownerOnly {
        if (owner != msg.sender) revert();
        token.transfer(owner, token.balanceOf(this));        
    }
    
    function withdrawEther() public ownerOnly {
        if (owner != msg.sender) revert();
        owner.transfer(address(this).balance);
    }   

    constructor(address _token, address _owner, address _dispatch, address _oracle) public {
        tokenAddress = _token;
        token = Token(_token);
        owner = _owner;
        dispatch = DispatchInterface(_dispatch);
        oracleAddr = _oracle;
    }
    
    function getOrder(uint256 id) public view returns (address, uint256){
        return (orderBook[id].client, orderBook[id].eth_amount);
    }

    /* Payable function that returns an amount of Zap based on the current exchange rate */
    function buyZap() public payable {
        if(msg.value > 0) {
            // query the price oracle
            bytes32[] memory params = new bytes32[](0);
            uint256 id = dispatch.query(oracleAddr, "ETH", "zapprice", params, false, true);
            // put the order in the orderbook
            orderBook[id].client = msg.sender;
            orderBook[id].eth_amount = msg.value;
        } else 
            revert();
    }

    // TO DO: SECURE IT!
    /* Called upon the provider fulfilling the query, enabling the faucet to fulfill the buy request */
    function callback(uint256 id, bytes32[] response) external {
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

