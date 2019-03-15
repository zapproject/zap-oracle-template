import {coincapResponder} from "./Responder";

export const  Config = {

//==============================================================================================================
// Provider Constants
//==============================================================================================================

    title: "Title",
    public_key: "abcdef",
    NODE_URL : "wss://kovan.infura.io/ws/xeb916AFjrcttuQlezyq",
    mnemonic :  "pact inside track layer hello carry used silver pyramid bronze drama time",
    EndpointSchema:{
        name: "CoinCapV2",
        curve :[1,1,10000000000],//Price curve, 7 + 0.01x ZAP per dot
        broker: "",
        md: "", //adding md file here
        queryList: [{
            query: "toUSD",
            params: ["from","precision"],
            response: ["result"],
            dynamic: false,//is set to true if a precision is set. otherwise false
            responseType:"[int]",
            getResponse: coincapResponder
        }] // can add more query types into this list
    }

};
