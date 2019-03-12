import {coincapResponder} from "./Responder";
import {EndpointSchema} from "./types";

export const Endpoints:EndpointSchema[] =[
    {
        name: "CoinCapAPI",
        curve :[2,7e18,1e16,10000000000],//Price curve, 7 + 0.01x ZAP per dot
        broker: "",
        md: "", //adding md file here
        queryList: [{
            query: "price",
            params: ["from","to"],
            response: ["price"],
            dynamic: false,//is set to true if a precision is set. otherwise false
            getResponse: coincapResponder
        }]
       
    }
   
]

