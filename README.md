#Zap-oracle-template

Template for creating and managing your own zap oracle with ease

##Layout :
 
1. Config : data about your wallet ,ethereum node and your provider's pubkey and title
2. Schema : Your oracle's endpoint list with their params and pre-defined query/response schema
3. Oracle : Template for Create/Manage flow 
4. Responder :  Stub callback function when receive query event and return result

##Usage :
 
1. Configure config and schema
2. Implement function `getResponse` in Responder
3. Run `npm start` to start create/get Oracle and start listening to queries   

##Note :
 
- Ensure you have enough ETH in your address for responding to queries

##Subscriber example

####Subscriber_contract_example 

- Onchain subscriber contract example 
    + Set provider to interact with
    + Query provider (regarding to provided schema from provider)
    + Implement callback for provider's response

#### Subscriber_example.js

- Offchain subscriber example
    + Query endpoint and params (regarding to provided schema from provider)
    + Listen to OffchainResponse event from Provider 

#### Demo.ts
- Workflow example from setting up oracle to running subscriber
