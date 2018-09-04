
export interface EndpointSchema{
    name: string,
    curve : number[],
    params: string[],
    query : string,
    response:string[],
    getResponse: Function
}

export interface QueryEvent{
    queryId: string,
    query: string,
    endpoint: string,
    subscriber: string,
    endpointParams: string[],
    onchainSub: boolean
}
