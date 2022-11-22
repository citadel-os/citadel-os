import * as spinner from './spinner20221121.js';
import {availKults, showErrors, showSuccess, getAccounts, getGasPrice} from './common20221121.js';

import {abiPilot, abiSovereignCollective} from './contracts/abi20221121.js';
import {CITADEL_PILOT, SOVEREIGN_COLLECTIVE, web3, apiKey} from './contracts/addr20221121.js';

//const CITADEL_PILOT = "";
const citadelPilot = new web3.eth.Contract(abiPilot, CITADEL_PILOT);
const sovereignCollective = new web3.eth.Contract(abiSovereignCollective, SOVEREIGN_COLLECTIVE);

export async function claimPilot(citadel) {
  var gasPrice = await getGasPrice();
  gasPrice = Math.trunc(gasPrice * 1.5);

  const accounts = await getAccounts();
  if(accounts.length <= 0) {
      throw new Error("connect to metamask");
  }

  const estimatedGas = await citadelPilot.methods.claim(citadel).estimateGas({from: accounts[0]});

  const tx = {
      'from': accounts[0],
      'to': CITADEL_PILOT,
      'data': citadelPilot.methods.claim(citadel).encodeABI(),
      'gas': web3.utils.toHex(estimatedGas),
      'gasPrice': web3.utils.toHex(gasPrice)
  };

  spinner.startSpinner();
  const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx],
  })
  .then(
    result => {
      showSuccess('claim pilot tx complete',result)
    },
    error => {
      showErrors(error.message)
    }).
  finally(() => {spinner.stopSpinner()});

  return txHash;
}

export async function mintPilot(pilots) {
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }
  
  const mintAmt = (.125 * pilots).toString();
  let ethWei = web3.utils.toWei(mintAmt, 'ether');
  ethWei = web3.utils.toHex(ethWei);

  const tx = {
    'from': accounts[0],
    'to': CITADEL_PILOT,
    'value': ethWei,
    'data': citadelPilot.methods.mintPilot(pilots).encodeABI()
  };
  
  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  })
  .then(
    result => {
      showSuccess('pilot mint tx complete',result)
    },
    error => {
      showErrors(error.message)
    }).
  finally(() => {spinner.stopSpinner()});
  
  return txHash;
}

export async function upLevelPilot(pilotId) {
  var gasPrice = await getGasPrice();
  gasPrice = Math.trunc(gasPrice * 1.5);
  
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }
  
  const estimatedGas = await citadelPilot.methods.upLevel(pilotId).estimateGas({from: accounts[0]});
  
  const tx = {
    'from': accounts[0],
    'to': CITADEL_PILOT,
    'data': citadelPilot.methods.upLevel(pilotId).encodeABI(),
    'gas': web3.utils.toHex(estimatedGas),
    'gasPrice': web3.utils.toHex(gasPrice)
  };
  
  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  })
  .then(
    result => {
      showSuccess('pilot level-up tx complete',result)
    },
    error => {
      showErrors(error.message)
    }).
  finally(() => {spinner.stopSpinner()});
  
  return txHash;
}

export async function buySovereignty(pilotId) {
  var gasPrice = await getGasPrice();
  gasPrice = Math.trunc(gasPrice * 1.5);
  
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }
  
  const estimatedGas = await citadelPilot.methods.sovereignty(pilotId).estimateGas({from: accounts[0]});
  
  const tx = {
    'from': accounts[0],
    'to': CITADEL_PILOT,
    'data': citadelPilot.methods.sovereignty(pilotId).encodeABI(),
    'gas': web3.utils.toHex(estimatedGas),
    'gasPrice': web3.utils.toHex(gasPrice)
  };
  
  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  })
  .then(
    result => {
      showSuccess('sovereignty tx complete',result)
    },
    error => {
      showErrors(error.message)
    }).
  finally(() => {spinner.stopSpinner()});
  
  return txHash;
}

export async function checkPilot(pilotId) { // Does not require a connected wallet
  const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTMetadata`;
  const contractAddr = CITADEL_PILOT;
  const tokenId = pilotId;
  const tokenType = "erc721";

  var config = {
    method: 'get',
    url: `${baseURL}?contractAddress=${contractAddr}&tokenId=${tokenId}&tokenType=${tokenType}`,
    headers: { }
  };

  await axios(config)
    .then(response => {
      response.data.metadata.attributes.forEach(i => {showSuccess(`${i.trait_type.toString().toLowerCase()}: ${i.value.toString().toLowerCase()}`)});
    })
    .catch(error => console.log(error));

  const pilot = await citadelPilot.methods.getOnchainPILOT(pilotId).call();
  //add error handling

  //TODO add cost to overthrow
  if (pilot[0] ==  true) {
    const sovereign = await citadelPilot.methods.getSovereign(pilotId).call();
    showSuccess(`sovereign: ${pilot[0]}`);
    showSuccess(`level: ${pilot[1]}`);
    showSuccess(`kult: ${availKults[sovereign[2]]}`);
    showSuccess(`kult bribes: ${sovereign[1]}`);
  } else {
    showSuccess(`sovereign: ${pilot[0]}`);
    showSuccess(`level: ${pilot[1]}`);
  }
  
  const owner = await citadelPilot.methods.ownerOf(pilotId).call()
  .then( async (result) => {
      showSuccess(`owner: ${result}`);  //  <<<< Make this a link to `check wallet`
  },error => {
    showErrors(error.message)
  });

  return;
}

export async function overthrowSovereign(sovereignId,pilotId) {
  var gasPrice = await getGasPrice();
  gasPrice = Math.trunc(gasPrice * 1.5);
  
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }
  
  const estimatedGas = await citadelPilot.methods.overthrowSovereign(sovereignId,pilotId).estimateGas({from: accounts[0]});
  
  const tx = {
    'from': accounts[0],
    'to': CITADEL_PILOT,
    'data': citadelPilot.methods.overthrowSovereign(sovereignId,pilotId).encodeABI(),
    'gas': web3.utils.toHex(estimatedGas),
    'gasPrice': web3.utils.toHex(gasPrice)
  };
  
  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  })
  .then(
    result => {
      showSuccess('overthrow tx complete',result)
    },
    error => {
      showErrors(error.message)
    }).
  finally(() => {spinner.stopSpinner()});
  
  return txHash;
}

export async function bribeKult(sovereignId,kult) {
  var gasPrice = await getGasPrice();
  gasPrice = Math.trunc(gasPrice * 1.5);
  
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }
  
  const estimatedGas = await citadelPilot.methods.bribeKult(sovereignId,kult).estimateGas({from: accounts[0]});
  
  const tx = {
    'from': accounts[0],
    'to': CITADEL_PILOT,
    'data': citadelPilot.methods.bribeKult(sovereignId,kult).encodeABI(),
    'gas': web3.utils.toHex(estimatedGas),
    'gasPrice': web3.utils.toHex(gasPrice)
  };
  
  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  })
  .then(
    result => {
      showSuccess('bribe tx complete',result)
    },
    error => {
      showErrors(error.message)
    }).
  finally(() => {spinner.stopSpinner()});
  
  return txHash;
}

export async function claimSovereign(sovereignId) {
  var gasPrice = await getGasPrice();
  gasPrice = Math.trunc(gasPrice * 1.5);

  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }

  const estimatedGas = await sovereignCollective.methods.claimSovereign(sovereignId).estimateGas({from: accounts[0]});

  const tx = {
      'from': accounts[0],
      'to': SOVEREIGN_COLLECTIVE,
      'data': sovereignCollective.methods.claimSovereign(sovereignId).encodeABI(),
      'gas': web3.utils.toHex(estimatedGas),
      'gasPrice': web3.utils.toHex(gasPrice)
  };

  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  }).then(result => {
    showSuccess('claim sovereign tx complete',result)
  },error => {
    showErrors(error.message)
  }).finally(() => {
    spinner.stopSpinner()
  });

  return txHash;
}

//PILOT PUBLIC FUNCTIONS
async function getSovereign(sovereignId) {
  return (await citadelPilot.methods.getSovereign(sovereignId).call());
}

async function getSovereignCharge(sovereignId,chargeIndex) {
  return (await citadelPilot.methods.getSovereignCharge(sovereignId,chargeIndex).call());
}
  
async function getCitadelClaim(citadelId) {
  return (await citadelPilot.methods.getCitadelClaim(citadelId).call());
}
  
async function getOnchainPILOT(pilotId) {
  return (await citadelExordium.methods.getOnchainPILOT(pilotId).call());
}
