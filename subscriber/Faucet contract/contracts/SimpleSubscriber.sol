pragma solidity ^0.4.24;

interface Client1 {
    /// callback that dispatch will call after a provider response
    function callback(uint256 id, string response1) external;
}

// interface of Zap Dispatch contract, which escrows dots and routes queries
interface DispatchInterface {
    // Routes a query through Dispatch to an oracle, passing in a query and endpoint specifiers
    // This will consume 1 DOT
    function query(address, string, bytes32, bytes32[]) external returns (uint256);
    // Cancels a query that has yet to be fulfilled, returning the DOT from escrow
    function cancelQuery(uint256) external;
}

/* Contract implements a basic Client1 and query/callback functionality */
contract SimpleSubscriber {

	event SentQuery(uint256 queryId, string query, bytes32 endpoint, bytes32[] params);
	event ReceivedResult(uint256 queryId, string result);

	/* instance of Zap Dispatch */
	DispatchInterface dispatch;

	/* address of the oracle to query */
	address public oracle;

	/* Permissions */
	address public owner;
    
    /* Constructor defines the addresses of the dispatch and oracle */
	constructor(address _dispatch, address _oracle) public{
		dispatch = DispatchInterface(_dispatch);
		oracle = _oracle;
		owner = msg.sender;
	}

	/* Simple example query function to dispatch. Puts one DOT into escrow. 
	 * DOT is given to the oracle after the query is fulfilled */
	function sendQuery() external {
		require(msg.sender == owner);
		bytes32[] memory arr = new bytes32[](0);
		// query call takes in an oracle address, query string, endpoint specifier, endpoint parameters (none for this query)
		uint256 queryId = dispatch.query(oracle, "ETH", "zapprice", arr);
		/*
		 * query: "ETH" => base of exchange rate
		 * endpoint: "zapprice" => endpoint specifier 
		 * endpoint parameters: [] => no endpoint parameters here (can be added for customized data)
		 */

		// do something with queryId
		emit SentQuery(queryId, "ETH", "zapprice", arr);
	}

	/* Callback is called by Dispatch upon a response from the oracle */
	/* Data from oracle will be sent through this function */
	function callback(uint256 id, string response1) external {
		require(msg.sender == address(dispatch));

		// do something with the data
		emit ReceivedResult(id, response1);
	}

}
