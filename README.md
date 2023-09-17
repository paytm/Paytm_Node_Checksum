# Paytm Checksum - Node Language

This library provides a simple way to generate and verify checksums for Paytm transactions in Node.js. It ensures the integrity and authenticity of transaction data exchanged between your application and the Paytm gateway.

For more details and comprehensive documentation, please refer to the official [Paytm Checksum documentation](https://developer.paytm.com/docs/checksum/#node).

## Prerequisites

Before you can use the Paytm Checksum library, make sure you have the following prerequisites in place:

- Node.js version 6.0 or higher installed on your system.
- The crypto module, which is a built-in Node.js module.

## Installation

To get started with the Paytm Checksum library, you can install it using npm:

```bash
npm install paytmchecksum
```

## Usage

To use the Paytm Checksum library in your Node.js application, follow these steps:

### Import the paytmchecksum module

You can import the paytmchecksum module using either CommonJS or ES6 syntax, depending on your project's configuration.

For CommonJS:

```javascript
var paytmChecksum = require('paytmchecksum');
```

For ES6:

```javascript
import paytmChecksum from 'paytmchecksum';
```

## Generate Checksum

To generate a checksum, you need to provide the necessary parameters and your merchant key.

Example: Generate Checksum via Array

```javascript
var paytmParams = {
  "MID": "YOUR_MID_HERE",
  "ORDERID": "YOUR_ORDER_ID_HERE"
};

var merchantKey = "YOUR_MERCHANT_KEY";

var checksum = paytmChecksum.generateSignature(paytmParams, merchantKey);

checksum.then(function(result){
  console.log("generateSignature Returns: " + result);
}).catch(function(error){
  console.log(error);
});
```

Example: Generate Checksum via JSON String

```javascript
var body = "{\"mid\":\"YOUR_MID_HERE\",\"orderId\":\"YOUR_ORDER_ID_HERE\"}";

var merchantKey = "YOUR_MERCHANT_KEY";

var checksum = paytmChecksum.generateSignature(body, merchantKey);

checksum.then(function(result){
  console.log("generateSignature Returns: " + result);
}).catch(function(error){
  console.log(error);
});
```

## Verify Checksum

To verify a checksum, you need the original parameters, your merchant key, and the checksum to be verified.

```javascript
var paytmParams = {
  "MID": "YOUR_MID_HERE",
  "ORDERID": "YOUR_ORDER_ID_HERE"
};

var merchantKey = "YOUR_MERCHANT_KEY";

var checksum = "CHECKSUM_TO_BE_VERIFIED";

var verifyChecksum = paytmChecksum.verifySignature(paytmParams, merchantKey, checksum);

verifyChecksum.then(function(result){
  console.log("verifySignature Returns: " + result);
}).catch(function(error){
  console.log(error);
});
```

## More Information

For more detailed information and advanced usage, please refer to the official [Paytm Checksum documentation](https://developer.paytm.com/docs/checksum/#node).