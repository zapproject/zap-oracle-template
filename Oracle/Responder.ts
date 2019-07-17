const request = require('request');
const web3=require('web3')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const tmp = require('tmp');


async function getCLOC(repository:any) {
    const tmpobj = tmp.dirSync();
    const { _, git_err } = await exec("git clone " + repository + " " + tmpobj.name);

    if ( git_err ) {
        console.warn("Git Error:", git_err);
    }

    const { stdout, stderr } = await exec("cloc --json --git " + tmpobj.name);

    if ( stderr ) {
        throw new Error("Failed to run cloc: " + stderr.toString());
    }

    // console.log(JSON.parse(stdout));
    // console.log(JSON.parse(stdout)["SUM"]["code"]);
    tmpobj.removeCallback();
    return JSON.parse(stdout)["SUM"]["code"];
}


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
        
        var count:number=0;
        var most:number = 0;
        var winnerIndex:number=1;
        for(var p = 0;p<params.length;p++){
        var url:string = "https://github.com/"+params[p]
        count =  await getCLOC(url);
        console.log(url)
        
        console.log(count)
        if(count>most){
            most=count
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

var x = getResponse("",["zapproject/zap-ethereum-api","zapproject/zap-oracle-template"])