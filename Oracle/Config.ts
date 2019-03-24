import {coincapResponder} from "./Responder";

export const  Config = {

//==============================================================================================================
// Provider Constants
//==============================================================================================================

    title: "Title",
    public_key: "abcdef",
    NODE_URL : "wss://kovan.infura.io/ws/xeb916AFjrcttuQlezyq",
    mnemonic :  "",
    EndpointSchema:{
        name: "CoinCapV2",
        curve :[2,7000000000000000000,10000000000000000,10000000],//price curve, 10000000000000000x + 7000000000000000000, https://bit.ly/2JBGDNU 
        broker: "",
        md: "", //adding md file here
        queryList: [{
            query: "toUSD",
            params: ["from","precision"],
            response: ["result"],
            dynamic: true,//is set to true if a precision is set. otherwise false
            responseType:"[int]",
            getResponse: coincapResponder
        }] // can add more query types into this list
    }

};
