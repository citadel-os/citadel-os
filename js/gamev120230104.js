import * as spinner from './spinner20230104.js';
import {showErrors, showSuccess, getAccounts, getGasPrice, dkScale} from './common20230104.js';

import {abiCitadelGameV1, abiNFT, abiDrakma, abiPilot} from './contracts/abi20230104.js';
import {CITADEL_GAMEV1, CITADEL_NFT, CITADEL_DRAKMA, CITADEL_PILOT, web3, apiKey, alchemy} from './contracts/addr20230104.js';

const citadelGameV1 = new web3.eth.Contract(abiCitadelGameV1, CITADEL_GAMEV1);
const citadelNFT = new web3.eth.Contract(abiNFT, CITADEL_NFT);
const citadelDrakma = new web3.eth.Contract(abiDrakma, CITADEL_DRAKMA);
const citadelPilot = new web3.eth.Contract(abiPilot, CITADEL_PILOT);

export async function approveDrakma(amt) {
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
        throw new Error("connect to metamask");
    }

    var amtWei = web3.utils.toWei(amt.toString());

    let gas = {}
    try {gas = await calcGas({
        account: accounts[0],
        context: citadelDrakma.methods,
        func: 'approve',
        args: [CITADEL_GAMEV1, amtWei]
    })} catch(e) {
        showErrors(`${e.message}`);
        return;
    };

    const tx = {
        'from': accounts[0],
        'to': CITADEL_DRAKMA,
        'data': citadelDrakma.methods.approve(CITADEL_GAMEV1, amtWei).encodeABI(),
        'gas': web3.utils.toHex(gas.estimatedGas),
        'gasPrice': web3.utils.toHex(gas.gasPrice)
    };

    spinner.startSpinner();
    const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
    }).then(result => {
        showSuccess('approve tx complete',result)
    },error => {
        showErrors(error.message)
    }).finally(() => {
        spinner.stopSpinner()
    });

    return txHash;
}

export async function approveCitadel() {
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
      throw new Error("connect to metamask");
    }
  
    const tx = {
    'from': accounts[0],
    'to': CITADEL_NFT,
    'data': citadelNFT.methods.setApprovalForAll(CITADEL_GAMEV1, true).encodeABI()
    };

    spinner.startSpinner();
    const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
    }).then(result => {
    showSuccess('approve tx complete',result)
    },error => {
    showErrors(error.message)
    }).finally(() => {
    spinner.stopSpinner()
    });

    return txHash;
}

export async function approvePilot() {
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
      throw new Error("connect to metamask");
    }
  
    const tx = {
    'from': accounts[0],
    'to': CITADEL_PILOT,
    'data': citadelPilot.methods.setApprovalForAll(CITADEL_GAMEV1, true).encodeABI()
    };

    spinner.startSpinner();
    const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
    }).then(result => {
    showSuccess('approve tx complete',result)
    },error => {
    showErrors(error.message)
    }).finally(() => {
    spinner.stopSpinner()
    });

    return txHash;
}

export async function liteGrid(citadelId, pilotIds, gridId, factionId) {
    var gasPrice = await getGasPrice();
    gasPrice = Math.trunc(gasPrice * 1.5);
  
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
        throw new Error("connect to metamask");
    }
    
    const estimatedGas = await citadelGameV1.methods.liteGrid(citadelId, pilotIds, gridId, factionId).estimateGas({from: accounts[0]});

    const tx = {
        'from': accounts[0],
        'to': CITADEL_GAMEV1,
        'data': citadelGameV1.methods.liteGrid(citadelId, pilotIds, gridId, factionId).encodeABI(),
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
        showSuccess('lite to grid tx complete',result)
      },
      error => {
        showErrors(error.message)
      }).
    finally(() => {spinner.stopSpinner()});
  
    return txHash;
}

export async function dimGrid(citadelId) {
    var gasPrice = await getGasPrice();
    gasPrice = Math.trunc(gasPrice * 1.5);
  
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
        throw new Error("connect to metamask");
    }
    
    const estimatedGas = await citadelGameV1.methods.dimGrid(citadelId).estimateGas({from: accounts[0]});
  
    const tx = {
        'from': accounts[0],
        'to': CITADEL_GAMEV1,
        'data': citadelGameV1.methods.dimGrid(citadelId).encodeABI(),
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
        showSuccess('dim grid tx complete',result)
      },
      error => {
        showErrors(error.message)
      }).
    finally(() => {spinner.stopSpinner()});
  
    return txHash;
}

export async function claim(citadelId) {
    var gasPrice = await getGasPrice();
    gasPrice = Math.trunc(gasPrice * 1.5);
  
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
        throw new Error("connect to metamask");
    }
    
    const estimatedGas = await citadelGameV1.methods.claim(citadelId).estimateGas({from: accounts[0]});
  
    const tx = {
        'from': accounts[0],
        'to': CITADEL_GAMEV1,
        'data': citadelGameV1.methods.claim(citadelId).encodeABI(),
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
        showSuccess('claim tx complete',result)
      },
      error => {
        showErrors(error.message)
      }).
    finally(() => {spinner.stopSpinner()});
  
    return txHash;
}

export async function trainFleet(citadelId, sifGattaca, mhrudvogThrot, drebentraakht) {
    var gasPrice = await getGasPrice();
    gasPrice = Math.trunc(gasPrice * 1.5);
  
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
        throw new Error("connect to metamask");
    }
    
    const estimatedGas = await citadelGameV1.methods.trainFleet(citadelId, sifGattaca, mhrudvogThrot, drebentraakht).estimateGas({from: accounts[0]});
  
    const tx = {
        'from': accounts[0],
        'to': CITADEL_GAMEV1,
        'data': citadelGameV1.methods.trainFleet(citadelId, sifGattaca, mhrudvogThrot, drebentraakht).encodeABI(),
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
        showSuccess('train tx complete',result)
      },
      error => {
        showErrors(error.message)
      }).
    finally(() => {spinner.stopSpinner()});
  
    return txHash;
}

export async function sendRaid(fromCitadel, toCitadel, pilotTokens, sifGattaca, mhrudvogThrot, drebentraakht) {
    var gasPrice = await getGasPrice();
    gasPrice = Math.trunc(gasPrice * 1.5);
  
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
        throw new Error("connect to metamask");
    }
    
    const estimatedGas = await citadelGameV1.methods.sendRaid(fromCitadel, toCitadel, pilotTokens, sifGattaca, mhrudvogThrot, drebentraakht).estimateGas({from: accounts[0]});

    const tx = {
        'from': accounts[0],
        'to': CITADEL_GAMEV1,
        'data': citadelGameV1.methods.sendRaid(fromCitadel, toCitadel, pilotTokens, sifGattaca, mhrudvogThrot, drebentraakht).encodeABI(),
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
        showSuccess('raid tx complete',result)
      },
      error => {
        showErrors(error.message)
      }).
    finally(() => {spinner.stopSpinner()});
  
    return txHash;
}

export async function resolveRaid(fromCitadel) {
    var gasPrice = await getGasPrice();
    gasPrice = Math.trunc(gasPrice * 1.5);
  
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
        throw new Error("connect to metamask");
    }
    
    const estimatedGas = await citadelGameV1.methods.resolveRaid(fromCitadel).estimateGas({from: accounts[0]});

    const tx = {
        'from': accounts[0],
        'to': CITADEL_GAMEV1,
        'data': citadelGameV1.methods.sendRaid(fromCitadel).encodeABI(),
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
        showSuccess('resolution tx complete',result)
      },
      error => {
        showErrors(error.message)
      }).
    finally(() => {spinner.stopSpinner()});
  
    return txHash;
}

async function calcGas({account, context, func, args = null}) {
    let gasPrice = await getGasPrice();
    gasPrice = Math.trunc(gasPrice * 1.5);
  
    let estimatedGas = await context[func].apply(null,args?args:null).estimateGas({from: account})
      .catch((error) => {throw new Error(error.message);});
  
    return {gasPrice,estimatedGas};
}