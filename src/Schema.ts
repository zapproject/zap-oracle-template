import {getResponse} from "./Responder";

export const Endpoints =[
    {
        name: "",
        curve :[],
        params: [],
        query : "",
        response:[],
        getResponse: getResponse
    }
        ,
    {
        name:"",
        curve:[],
        params: [],
        query:"",
        response:[],
        getResponse: getResponse
        //response format  options  are reponse methods :respondBytes32Array, respondIntArray, respond1, respond2, respond3, respond4
        }
    ]






/**
 * Example for Endpoint Schema
 Endpoints = [
 {
    name: ""Index Price",
    curve :[1,1,10000000], //1 wei zap per dot, fixed price
    params:["coin","price","respond1"],
    query: {time from  now},
    response: [{price}]
 },
 {
    name : "Volume",
    curve: [1,1,10000000],
    params: ["coin","volume","respond2"],
    query: {time from now},
    response : [{volume},{buy/sell}]
 }
 ]
 */