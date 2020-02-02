# Installation Steps

1. Copy the 'paytm' folder, index.js, router.js and server.js into your project directory.
2. Please set the required parameters in 'paytm/paytm_config.js' file. These parameters will be received after completing the registration process with Paytm.
3. For the Generate Checksum URL, please use the case for '/generate_checksum' in the router.js file. For example, a generate checksum URL may look like yoursite/generate_checksum
4. For the Verify Checksum URL, please use the case for '/verify_checksum' in the router.js file. For example, a verify checksum URL may look like yoursite/verify_checksum

# For Offline(Wallet Api) Checksum Utility below are the methods:
  1. genchecksumbystring : For generating the checksum
  2. verifychecksumbystring : For verifing the checksum
