pragma solidity ^0.4.24;

contract Client1 {
    /// callback that dispatch will call after a provider response
    function callback(uint256 id, string response1) external;
}

// interface of Zap Dispatch contract, which escrows dots and routes queries
interface DispatchInterface {
    // Routes a query through Dispatch to an oracle, passing in a query and endpoint specifiers
    // This will consume 1 DOT
    function query(address, string, bytes32, bytes32[], bool, bool) external returns (uint256);
    // Cancels a query that has yet to be fulfilled, returning the DOT from escrow
    function cancelQuery(uint256) external;
}

contract ExampleSubscriber {

	event SentQuery(uint256 queryId, string query, bytes32 endpoint, bytes32[] params);
	event ReceivedResult(uint256 queryId, string result);

	/* instance of Zap Dispatch */
	DispatchInterface dispatch;

	/* address of the oracle to query */
	address public oracle;

	/* Permissions */
	address public owner;
    modifier ownerOnly {
        require(msg.sender == owner); 
        _;
    }

    /* Constructor defines the addresses of the dispatch and oracle */
	constructor(address _dispatch, address _oracle) public{
		dispatch = DispatchInterface(_dispatch);
		oracle = _oracle;
		owner = msg.sender;
	}

	/* Simple query function consumes one DOT */
	function sendQuery(string query, bytes32 endpoint, bytes32[] params) external ownerOnly {
		// query call takes in an oracle address, query string, endpoint specifier, endpoint parameters,
		// and booleans for whether the provider and subscriber are on-chain or off-chain
		uint256 queryId = dispatch.query(oracle, query, endpoint, params, false, true);
		
		emit SentQuery(queryId, query, endpoint, params);
	}

	/* Callback is called by Dispatch upon a response from the oracle */
	function callback(uint256 id, string response1) external {
		require(msg.sender == address(dispatch));

		// do something with the data
		emit ReceivedResult(id, response1);
	}

}
