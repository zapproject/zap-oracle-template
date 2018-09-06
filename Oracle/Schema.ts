import {getResponse} from "./Responder";
import {EndpointSchema} from "./types";

export const Endpoints:EndpointSchema[] =[
    {
        name: "",
        curve :[],
        queryList: [{
            query:"",
            params:[],
            response: [],
            getResponse: getResponse
        },
            {
                query:"",
                params:[],
                response: [],
                getResponse: getResponse
            }]
    }
    //response format  options  are reponse methods :respondBytes32Array, respondIntArray, respond1, respond2, respond3, respond4
]



/**
 * Example for Endpoint Schema
 {
        name: "CoinBaseSource",
        curve :[1,1,1e18],
        queryList: [{
            query:"price",
            params:["{coin}","{time}"],
            response: ["{price}","{notaryHash}"],
            getResponse: getResponse
        },
            {
                query:"volume",
                params:["{coin}","{period}"],
                response: ["{volume}","{notaryHash}"],
                getResponse: getResponse
            }]
    }
 */