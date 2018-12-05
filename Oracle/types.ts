

export interface QueryEvent{
    queryId: string,
    query: string,
    endpoint: string,
    subscriber: string,
    endpointParams: string[],
    onchainSub: boolean
}
export interface EndpointSchema{
    name:string,
    curve:number[] ,
    queryList:QuerySchema[],
    broker:string,
    md:string
}


export interface QuerySchema{
    params:string[],
    query:string,
    response:string[],
    dynamic:boolean,
    getResponse:Function
}