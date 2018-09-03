export const Endpoints =[
        {
            name: "",
            curve :[],
            schema:[
                {
                params: [],
                query : "",
                response: []
            },
                {
                    params: [],
                    query:"",
                    response:[]
                }
            ], //available params for this endpoint
            query:[],
            response:[]
            //response format  options  are reponse methods :respondBytes32Array, respondIntArray, respond1, respond2, respond3, respond4
        }
    ]



/**
 Endpoints = [
 {
    name: ""Index Price",
    curve :[1,1,10000000], //1 wei zap per dot, fixed price
    schema:[
    {
        params:["BTC","price","respond1"],
        query: {time from  now},
        response: {price}
    },
    {
        params: ["BTC","volume","respond2"],
        query: {time from now},
        reponse : [{volume},{buy/sell}]
    }
 ]
 }
 ]
 */