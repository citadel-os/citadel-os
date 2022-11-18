import * as spinner from './spinner20221116.js';
import {availKults, showErrors, showSuccess, getAccounts, getGasPrice} from './common20221116.js';

import {abiPilot} from './contracts/abi20221116.js';
import {CITADEL_PILOT, web3} from './contracts/addr20221116.js';

//const CITADEL_PILOT = "";
const citadelPilot = new web3.eth.Contract(abiPilot, CITADEL_PILOT);

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