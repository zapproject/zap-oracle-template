pragma solidity ^0.4.24;

import "./dependencies/Client.sol";
import "./dependencies/DispatchInterface.sol";
import "./dependencies/BondageInterface.sol";
import "./dependencies/ERC20.sol";

/* Creates a Bet between two parties based on the weather */
contract WeatherContract is ClientBytes32Array {

	event Join(address bettor, bool upper, uint256 value);

    event Result(uint256 timestamp, uint256 temp, uint256 threshold);

	ERC20 token;
	DispatchInterface dispatch;
	BondageInterface bondage;

    // address of the weather data provider
    address weatherOracle;

    // endpoint of the oracle to call
    bytes32 endpoint;

    // amount of money placed in contract
    uint256 amount;

    // threshold value for the weather
    uint256 threshold;

    // unix timestamp for when this bet will be executed
    uint256 fulfillment;

    // true iff both parties have joined the bet
    bool joined;

    // address of upper bettor (betting that the weather will be higher)
    address upper;

    // address of lower bettor
    address lower;

    constructor(address tokenAddress, address dispatchAddress, address bondageAddress, address oracle, uint256 _threshold, uint256 time, bytes32 endpoint) public {
      token = ERC20(tokenAddress);
      dispatch = DispatchInterface(dispatchAddress);
      bondage = BondageInterface(bondageAddress);
      weatherOracle = oracle;
      threshold = _threshold;
      fulfillment = time;
  }

    function startBet(bool up) payable {
        // cannot start an already started bet or an expired bet
        if(joined) revert();
        if(block.timestamp > fulfillment) revert();
        amount = msg.value;

        if(up){ 
            upper = msg.sender;
        } else {
            lower = msg.sender;
        }
    }   

    function joinBet(bool up) payable {
        if(joined) revert();
        if(block.timestamp > fulfillment) revert();

        if(msg.value < amount) revert();
        amount += msg.value;

        if(up){
            if(upper != 0) revert();
            upper = msg.sender;
        } else {
            if(lower != 0) revert();
            lower = msg.sender;
        }
        joined = true;
    }

    /* Begins the process of resolving the bet */
    function resolve() external {
        // resolve bet if only one person joined
        if(!joined){
            if(upper!=0) upper.send(amount);
            if(lower != 0) lower.send(amount);
        }

        // only the bettors can resolve the bet
        if(msg.sender != upper && msg.sender != lower) revert();
        if(block.timestamp < fulfillment) revert();

        dispatch.query(weatherOracle, fulfillment, endpoint, [], false, true);
    }

    /*
    Resolves the bet based on the received temperature
    */
    function callback(uint256 id, bytes32[] response) external {
        uint256 temp = uint256(response[0]);

    	emit Result(block.timestamp, temp, threshold);

        if(temp > threshold){
            upper.send(amount);
        } else {
            lower.send(amount);
        }
    }

}
