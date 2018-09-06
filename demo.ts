import {Oracle} from "./src/Oracle";
import {queryProvider} from "./subscriber/Susbcriber_example"

//to run on the oracle server
const oracle = new Oracle()
oracle.initialize().catch(console.error)

oracle.getProvider()
    .then((provider)=>{ //provider address is given to subscriber
        queryProvider(provider.providerOwner) //to be called on subscriber server
            .then(console.log)
            .catch(console.error)
    })
