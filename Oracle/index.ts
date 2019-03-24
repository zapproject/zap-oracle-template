import {ZapOracle} from "./Oracle";

const oracle = new ZapOracle()
oracle.initialize().catch(console.error)
