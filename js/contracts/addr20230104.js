const useTestnet = false; // testnet OR mainnet

export let CITADEL_NFT;
export let CITADEL_EXORDIUM;
export let CITADEL_DRAKMA;
export let CITADEL_PILOT;
export let CITADEL_BATCH;
export let SOVEREIGN_COLLECTIVE;
export let CITADEL_GAMEV1;
export let web3;
export let etherscan;
export let apiKey;
export let alchemy;

if (useTestnet) {
  //  ----- goerli -----
  CITADEL_NFT = "0x26217E5e89db74F7D3C1fb272E536037CE952eB3";
  CITADEL_EXORDIUM = "0x202AC37AA25Af0eCb6b3f8f202e17427EE4fc8c9";
  CITADEL_DRAKMA = "0xb446a352A52912ED11483dB2489a0513E07593C6";
  CITADEL_PILOT = "0xd6858e5AE5c3546b8a144b75FD9E23bdeE45F030";
  CITADEL_BATCH = "0x2d36AfAa69b721240D70D65801F164826B983B35";
  SOVEREIGN_COLLECTIVE = "0x6825e0B01629bB940170c3AE0Dbe1eEAFE7E7240";
  CITADEL_GAMEV1 = "0xb648E5460Fe6Cd5948FF93e9921215A5aD9D21aF";
  apiKey = "IfQOw2VsmU96YhYUF2ydine8Ah1l3mVl";
  alchemy = "eth-goerli.g.alchemy.com"
  web3 = new Web3(`https://${alchemy}/v2/${apiKey}`);
  etherscan = "goerli.etherscan.io";
} else {
  //  ----- mainnet -----
  CITADEL_NFT = "0xaF08134eA12494dc3AAA7f1EFB23A8753B7F84c9";
  CITADEL_EXORDIUM = "0xFBF5a1F788E5F107D25Fc0824ed5E105b90fE027";
  CITADEL_DRAKMA = "0x927ce35c89ab901eefbc0675336ae4a31e658b0e";
  CITADEL_PILOT = "0xD653B9f4ec70658402B9634E7E0eAFcc64138Cad";
  CITADEL_BATCH = "";
  SOVEREIGN_COLLECTIVE = "0xc93aE64f0db8e68CF6aa05DEfeEE25b337eeC0DE";
  CITADEL_GAMEV1 = "";
  apiKey = "UcDDOYtVoT89tLIOD4POxzrhfvQAiHYO";
  alchemy = "eth-mainnet.alchemyapi.io"
  web3 = new Web3(`https://${alchemy}/v2/${apiKey}`);
  etherscan = "etherscan.io";
}

