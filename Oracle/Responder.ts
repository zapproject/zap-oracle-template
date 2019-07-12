const request = require('request');
const web3=require('web3')
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
	//Get data based on the query string and Parameters

		 try  {
        var timestamp:any = parseInt(params[0])//Date.parse(params[2])/1000
        // var timestamp:any = Date.parse('2019-01-01T03:24:00')/1000
        console.log(timestamp)
        var commitCount:number=0;
        var mostCommits:number = 0;
        var winnerIndex:number=1;
        for(var p = 1;p<params.length;p++){
        var url:string = "https://api.github.com/repos/"+params[p]+"/stats/contributors"//?w="+timestamp;
        
        console.log(url)
        var agent:string = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';
        const body:any = await requestPromise(url,null,{'User-Agent': agent});
        const json:any = JSON.parse(body);

        commitCount = 0;
        for(var i=0;i<json.length;i++){
            for(var j = json[i]["weeks"].length-1;j>0;j--){
                if(json[i]["weeks"][j]["w"]<timestamp)break;
                commitCount+=json[i]["weeks"][j]["c"]
            }
        
        }
        console.log(commitCount)
        if(commitCount>mostCommits){
            mostCommits=commitCount
            winnerIndex=p
        }
        }
        console.log(web3.utils.asciiToHex(params[winnerIndex]))
        return [web3.utils.asciiToHex(params[winnerIndex])]
        
    }
    catch(error){
        return ["0","Unable to Access data. Try again later"]
    }

}

