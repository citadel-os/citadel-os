import * as spinner from './spinner20230104.js';
import {showErrors, showSuccess, getAccounts, getGasPrice, dkScale} from './common20230104.js';

import {abiCitadelGameV1} from './contracts/abi20230104.js';
import {CITADEL_GAMEV1, web3, apiKey, alchemy} from './contracts/addr20230104.js';

const citadelGameV1 = new web3.eth.Contract(abiCitadelGameV1, CITADEL_GAMEV1);

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
        showSuccess('lit to grid',result)
      },
      error => {
        showErrors(error.message)
      }).
    finally(() => {spinner.stopSpinner()});
  
    return txHash;
  }