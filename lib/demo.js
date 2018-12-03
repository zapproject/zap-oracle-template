"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Oracle_1 = require("./Oracle/Oracle");
const Susbcriber_example_1 = require("./subscriber/Susbcriber_example");
/**
 * This demo shows the simplest work flow
 * - oracle can be run on oracle server,
 * - oracle address then is given to subscriber
 * - subscriber start query on their part and listen to responses from provider
 */
//to run on the oracle server
const oracle = new Oracle_1.Oracle();
oracle.initialize().catch(console.error);
oracle.getProvider()
    .then((provider) => {
    Susbcriber_example_1.queryProvider(provider.providerOwner) //to be called on subscriber server
        .then(console.log)
        .catch(console.error);
});
