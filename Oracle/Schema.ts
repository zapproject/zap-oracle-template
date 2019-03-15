import {coincapResponder} from "./Responder";
import {EndpointSchema} from "./types";

export const Endpoints:EndpointSchema[] =[
    {
        name: "CoinCapV2",
        curve :[1,1,10000000000],//Price curve, 7 + 0.01x ZAP per dot
        broker: "",
        md: "", //adding md file here
        queryList: [{
            query: "toUSD",
            params: ["from","precision"],
            response: ["result"],
            dynamic: false,//is set to true if a precision is set. otherwise false
            getResponse: coincapResponder
        }]
       
    }
   
]

