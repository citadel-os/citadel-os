import * as spinner from './spinner20221122.js';
import {showErrors, showSuccess, getAccounts, getGasPrice, dkScale} from './common20221122.js';

import {abiExordium, abiNFT, abiDrakma, abiPilot} from './contracts/abi20221122.js';
import {CITADEL_NFT, CITADEL_EXORDIUM, CITADEL_DRAKMA, web3, CITADEL_PILOT, apiKey, alchemy} from './contracts/addr20221122.js';
import { typeWriter } from './terminal20221122.js';

//import axios from 'axios';

const citadelNFT = new web3.eth.Contract(abiNFT, CITADEL_EXORDIUM);
const citadelExordium = new web3.eth.Contract(abiExordium, CITADEL_EXORDIUM);
const citadelDrakma = new web3.eth.Contract(abiDrakma, CITADEL_DRAKMA);
const citadelPilot = new web3.eth.Contract(abiPilot, CITADEL_PILOT);

const citadelNFTFix = new web3.eth.Contract(abiNFT, CITADEL_NFT);

//For testing only
window.testContract = citadelExordium;

async function calcGas({account, context, func, args = null}) {
  let gasPrice = await getGasPrice();
  gasPrice = Math.trunc(gasPrice * 1.5);
  console.debug(`gasPrice: ${gasPrice}`);

  let estimatedGas = await context[func].apply(null,args?args:null).estimateGas({from: account})
    .catch((error) => {throw new Error(error.message);});
  console.debug(`estimatedGas: ${estimatedGas}`);

  return {gasPrice,estimatedGas};
}

export async function stake(arrCitadel, techIndex) {
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }

  let gas = {}
  try {gas = await calcGas({
    account: accounts[0],
    context: citadelExordium.methods,
    func: 'stake',
    args: [arrCitadel, techIndex]
  })} catch(e) {
    showErrors(`${e.message}`);
    return;
  };

  const tx = {
    'from': accounts[0],
    'to': CITADEL_EXORDIUM,
    'data': citadelExordium.methods.stake(arrCitadel, techIndex).encodeABI(),
    'gas': web3.utils.toHex(gas.estimatedGas),
    'gasPrice': web3.utils.toHex(gas.gasPrice)
  };

  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  }).then(result => {
    showSuccess('staking tx complete',result)
  },error => {
    showErrors(error.message)
  }).finally(() => {
    spinner.stopSpinner()
  });

  return txHash;
}

export async function withdraw(arrCitadel) {
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }

  let gas = {}
  try {gas = await calcGas({
    account: accounts[0],
    context: citadelExordium.methods,
    func: 'withdraw',
    args: [arrCitadel]
  })} catch(e) {
    showErrors(`${e.message}<br />That citadel ID may not belong to the connected wallet`);
    return;
  };

  const tx = {
    'from': accounts[0],
    'to': CITADEL_EXORDIUM,
    'data': citadelExordium.methods.withdraw(arrCitadel).encodeABI(),
    'gas': web3.utils.toHex(gas.estimatedGas),
    'gasPrice': web3.utils.toHex(gas.gasPrice)
  };

  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  }).then(result => {
    showSuccess('withdraw tx complete',result)
  }, error => {
    showErrors(error.message)
  }).finally(() => {
    spinner.stopSpinner()
  });

  return txHash;
}

export async function claimDrakma() {
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }

  let gas = {}
  try {gas = await calcGas({
    account: accounts[0],
    context: citadelExordium.methods,
    func: 'claimRewards'
  })} catch(e) {
    showErrors(`${e.message}`);
    return;
  };

  const tx = {
      'from': accounts[0],
      'to': CITADEL_EXORDIUM,
      'data': citadelExordium.methods.claimRewards().encodeABI(),
      'gas': web3.utils.toHex(gas.estimatedGas),
      'gasPrice': web3.utils.toHex(gas.gasPrice)
  };

  spinner.startSpinner();
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx],
  }).then(result => {
    showSuccess('claim drakma tx complete',result)
  },error => {
    showErrors(error.message)
  }).finally(() => {
    spinner.stopSpinner()
  });

  return txHash;
}

export async function approveCitadel(arrCitadel) {
  const accounts = await getAccounts();
  if(accounts.length <= 0) {
    throw new Error("connect to metamask");
  }

  for (var i = 0; i < arrCitadel.length; i++) { //THIS LOOP ISN'T WORKING, ONLY SEEMS TO CATCH FIRST TRANSACTION
    var tokenId = arrCitadel[i];

//    const estimatedGas = await citadelNFT.methods.approve(CITADEL_EXORDIUM, tokenId).estimateGas({from: accounts[0]});

    const tx = {
      'from': accounts[0],
      'to': CITADEL_NFT,
      'data': citadelNFT.methods.approve(CITADEL_EXORDIUM, tokenId).encodeABI()
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
}

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
    args: [CITADEL_PILOT, amtWei]
  })} catch(e) {
    showErrors(`${e.message}`);
    return;
  };

  const tx = {
    'from': accounts[0],
    'to': CITADEL_DRAKMA,
    'data': citadelDrakma.methods.approve(CITADEL_PILOT, amtWei).encodeABI(),
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

export async function checkDrakma(walletAddress = null) { // Does not (always) require a connected wallet
  let useWallet = walletAddress;
  if (!useWallet) {
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
      throw new Error("connect to metamask");
    }
    useWallet = accounts[0];
  }

  const rewardsPerHour = 166000000000000000000; //166 DK base / hr
  const periodFinish = 1674943200; //JAN 28 2023, 2PM PT   
  let dk = await citadelDrakma.methods.balanceOf(useWallet).call().then(Number());
  dk = (dk?(dk/dkScale):0);

  spinner.startSpinner();

  const stakerInfo = await citadelExordium.methods.stakers(useWallet).call();
  let unclaimedDK = Number(stakerInfo.unclaimedRewards);
  unclaimedDK = (unclaimedDK?(unclaimedDK/dkScale):0);
  const lastUpdate = stakerInfo.timeOfLastUpdate;
  const amtStaked = stakerInfo.amountStaked;

  const currBlock = await web3.eth.getBlock(await web3.eth.getBlockNumber())
  let calculatedDK = Number(((currBlock.timestamp < periodFinish ? currBlock.timestamp : periodFinish) - lastUpdate) * amtStaked * rewardsPerHour / 3600)
  calculatedDK = (calculatedDK?(calculatedDK/dkScale):0);

  let approvedDrakma = await citadelDrakma.methods.allowance(useWallet,CITADEL_PILOT).call().then((dk) => {return dk;});
  approvedDrakma = (approvedDrakma?(approvedDrakma/dkScale):0);

  spinner.stopSpinner();

  console.debug(`unclaimed: ${unclaimedDK}`);
  console.debug(`calculated: ${calculatedDK}`);
  
  await typeWriter(`wallet: ${new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(dk)} drakma`);
  await typeWriter(`unclaimed: ${new Intl.NumberFormat('en-US', {maximumFractionDigits: 0, maximumSignificantDigits: 5}).format(unclaimedDK + calculatedDK)} drakma`);
  await typeWriter(`approval: ${new Intl.NumberFormat('en-US', {maximumFractionDigits: 0, maximumSignificantDigits: 5}).format(approvedDrakma)} dramka`);

  return;
}

export async function checkCitadel(citadelId) { // Does not require a connected wallet
  const baseURL = `https://${alchemy}/nft/v2/${apiKey}/getNFTMetadata`;
  const contractAddr = CITADEL_NFT;
  const tokenId = citadelId;
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
  
  const owner = await citadelNFTFix.methods.ownerOf(citadelId).call()
  .then( async (result) => {
    if (result == CITADEL_EXORDIUM) {
      let staker = await getCitadelStaker(citadelId);
      showSuccess(`owner: ${staker}`);  //  <<<< Make this a link to `check wallet`
      showSuccess(`staked to exordium`);
    } else {
      showSuccess(`owner: ${result}`);  //  <<<< Make this a link to `check wallet`
      showSuccess(`not staked to exordium`);
    }
  },error => {
    showErrors(error.message)
  }).finally( async () => {
    let pilotMint = await citadelPilot.methods.getCitadelClaim(citadelId).call();
    if (pilotMint == 0) {
      showSuccess(`pilot not yet minted`);
    } else {
      showSuccess(`pilot minted: ${pilotMint}`);  //  <<<< Make this a link `check pilot`
    }
  });

  return;
}

export async function checkWallet(walletAddress = null) { // Does not (always) require a connected wallet
  let useWallet = walletAddress;
  if (!useWallet) {
    const accounts = await getAccounts();
    if(accounts.length <= 0) {
      throw new Error("connect to metamask");
    }
    useWallet = accounts[0];
  }

// WALLET INFO
//
//      Stakes Citadel ids
//         This probably needs to be done server-side, could 'just' be written to local (json) file after
//         For not, just a flag, whether the wallet has staked citadel
  let stakedCitadel = await getStakerInfo(useWallet);
  if (!isNaN(stakedCitadel[0]) && stakedCitadel[0] > 0) {showSuccess(`wallet owns staked citadel`)};

// Unstaked Citadel ids
  const options = {
    method: 'GET',
    url: `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs`,
    params: {
      owner: useWallet,
      contractAddresses: [CITADEL_NFT,CITADEL_PILOT],
      withMetadata: 'false'
    },
    headers: {accept: 'application/json'}
  };

  let pilots = [];
  let citadels = [];

  await axios
    .request(options)
    .then(function (response) {
      response.data.ownedNfts.forEach((nft) => {
        if (nft.contract.address.toLowerCase() == CITADEL_NFT.toLowerCase()) {
//          showSuccess(`citadel ${web3.utils.hexToNumber(nft.id.tokenId)}`);
          citadels.push(web3.utils.hexToNumber(nft.id.tokenId));
        } else if (nft.contract.address.toLowerCase() == CITADEL_PILOT.toLowerCase()) {
//          showSuccess(`pilot ${web3.utils.hexToNumber(nft.id.tokenId)}`);
          pilots.push(web3.utils.hexToNumber(nft.id.tokenId));
        } else {
          showErrors(`couldn't match token to contract`);
        }
      });
    })
    .catch(function (error) {
      console.error(error);
    }).finally(() => {
        if (citadels.length == 1) {
          showSuccess(`citadel: ${citadels[0]}`);
        } else if (citadels.length > 1) {
          showSuccess(`citadels: ${citadels.join(', ')}`);
        }
    
        if (pilots.length == 1) {
          showSuccess(`pilot: ${pilots[0]}`);
        } else if (pilots.length > 1) {
          showSuccess(`pilots: ${pilots.join(', ')}`);
        }
    });

//      drakma balances

  await checkDrakma(useWallet);

  return;
}

//EXORDIUM PUBLIC FUNCTIONS
async function getStakerInfo(walletAddress) {
  return (await citadelExordium.methods.getStaker(walletAddress).call());
}

export async function getAllTechTree() {
  return (await citadelExordium.methods.getAllTechTree().call());
}

async function getTechTree(index) {
  return (await citadelExordium.methods.getTechTree(index).call());
}

async function getCitadelStaker(tokenId) {
  return (await citadelExordium.methods.getCitadelStaker(tokenId).call());
}
