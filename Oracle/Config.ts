import {getResponse} from "./Responder";

export const  Config = {

//==============================================================================================================
// Provider Constants
//==============================================================================================================

    title: "",
    public_key: "0xBB",
    NODE_URL : "wss://mainnet.infura.io/ws/v3/63dbbe242127449b9aeb061c6640ab95",
    mnemonic :  "",
    EndpointSchema:{
        name: "", // Endpoint name
        curve : [ 2, //length of first curve ( c + ax )
  5000000000000000000, // 5 zap
  2000000000000000000, //2 zap * x
  1000, // max dots if first curve
  2, //length of second curve ( c + ax )
  0, //0
  3000000000000000000, //3 zap * x
  1000000000000000000 ] //max dots for second curve
,
        broker: "", //broker if any, default as 0x0 address for none
        md: "Getting current price for all pairs on Binance", //adding description here
        queryList: // one or more query type, instruct users what query string you accept and what is the responseType for each
        [
          {
            query: "<pair>", //query string accept from user
            params: [],
            dynamic: false, //response will be dynamic (bytes32[],int[]) or fixed (1,2,3,4 args in response)
            responseType:"[int]", //in this case, response type is fixed 1 reponse
            getResponse: getResponse // function getResponse will be called at queried
        },
      ] // can add more query types into this list
    }

};
