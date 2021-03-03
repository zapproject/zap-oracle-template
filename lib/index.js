"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Oracle_1 = require("./Oracle");
const oracle = new Oracle_1.ZapOracle();
oracle.initialize().catch(console.error);
