import {Oracle} from "./Oracle/Oracle";
import {queryProvider} from "./subscriber/Susbcriber_example"

/**
 * This demo shows the simplest work flow
 * - oracle can be run on oracle server,
 * - oracle address then is given to subscriber
 * - subscriber start query on their part and listen to responses from provider
 */
//to run on the oracle server
const oracle = new Oracle()
oracle.initialize().catch(console.error)

oracle.getProvider()
    .then((provider)=>{ //provider address is given to subscriber
        queryProvider(provider.providerOwner) //to be called on subscriber server
            .then(console.log)
            .catch(console.error)
    })
