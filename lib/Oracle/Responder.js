"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getResponse(event) {
    //Implement getting query info, and return response here
    return ["HelloWorld"];
}
function add(event){
const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
var result = ParseInt(endpointParams[0])+ParseInt(endpointParams[1])
return [""+result]
}
function subtract(event){
const { queryId, query, endpoint, subscriber, endpointParams, onchainSub } = event;
var result = ParseInt(endpointParams[0])-ParseInt(endpointParams[1])
return [""+result]
}
exports.getResponse = getResponse;
exports.add = add;
exports.subtract = subtract;


