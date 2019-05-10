
const request = require('request');

function requestPromise(url:string, method:any = "GET", headers:any = -1, data:any = -1) {
    var trans:any = {
        method: method,
        url: url,
    };
    if (headers != -1)
        trans.headers = headers;
    if (data != -1) {
        trans.data = data;
        trans.json = true;
    }
    return new Promise((resolve, reject) => {
        request(trans, (err:any, response:any, data:any) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

export async function getResponse(query:string,params:string[]|[]){
    const apiKey:string ='EDiUllDf6OcGqy1o7tBw4FkHchkXa0anYXA8j7h4'
    var url:string = "https://api.propublica.org/congress/v1/" + params[0] +"/bills/" + params[1]+".json"
    var body:any = await requestPromise(url, null, {'X-API-KEY' : apiKey});
    const json:any = JSON.parse(body);
    const result:any = json["results"][0]["votes"][0]["result"]
    const yes:any = json["results"][0]["votes"][0]["total_yes"]
    const no:any = json["results"][0]["votes"][0]["total_no"]
    const abstain:any = json["results"][0]["votes"][0]["total_not_voting"]
    const total = yes + no + abstain;
    const title = "Bill Title: " + json["results"][0]["title"]
    console.log(title)
    const ratio = "Result: "+ result +" with " + yes + " for and " + no+ " against";
    console.log(ratio)
    if (result =="Passed"){
        return [1,yes,no,abstain]
    }
    else{
        return [0,yes,no,abstain]    
    }

}
