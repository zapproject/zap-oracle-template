pragma solidity ^0.4.24;

import "./dependencies/Client.sol";
import "./dependencies/DispatchInterface.sol";

contract Token {
    function transfer(address to, uint256 amount) public returns (bool);
    function balanceOf(address addr) public view returns (uint256);
}
            
contract Faucet is ClientBytes32Array {
    Token token;
    address public owner;
    address public tokenAddress;

    uint public decimals = 10 ** 18;

    modifier ownerOnly {
        require(msg.sender == owner); 
        _;
    }
           
    constructor(address _token, address _owner) public {
        tokenAddress = _token;
        token = Token(_token);
        owner = _owner;
    }
    
    event Log(uint256 n1, uint256 n2);
    
    /* Payable function that returns an amount of Zap based on the current exchange rate */
    function buyZap() public payable {
        if(msg.value > 0) {
            uint256 amt = (msg.value / rate);
            amt = amt * decimals;
            if(amt <= token.balanceOf(this))
                token.transfer(msg.sender, amt);                
        }
        else {
            revert();
        }
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
}

