import {web3, etherscan} from './contracts/addr20221122.js';

//Global support functions
export function showErrors(message) {
  new_block();
  block_log(`<span class='error'>${message}<span>`);
}
 
export function showSuccess(message, tx = false) {
  new_block();
  if (tx) {
    block_log(`<span class='success'><a href="https://${etherscan}/tx/${tx}" target="_blank">${message}</a></span>`);
  } else {
    block_log(`<span class='success'>${message}<span>`);
  }
}

export function smart_split(input, del, empty_space) {
  if (input.length === 0) return input;
  var outputs = [""];

  var compare = function (base, insert, position) {
    if (position + insert.length > base.length) return false;
    for (var i = 0; i < insert.length; i++) {
      if (!(base.charAt(position + i) === insert.charAt(i))) return false;
    }
    return true;
  };

  var quotes = false;
  for (var i = 0; i < input.length; i++) {
    var char = input.charAt(i);
    if (char === '"') {
      quotes = !quotes;
      continue;
    }

    if (!quotes && compare(input, del, i)) {
      outputs.push("");
      i += del.length - 1;
      continue;
    }

    outputs[outputs.length - 1] += char;
  }

  if (!empty_space) {
    for (var i = 0; i < outputs.length; i++) {
      if (outputs[i] === "") {
        outputs.splice(i, 1);
      }
    }
  }

  return outputs;
}

export async function getAccounts() {
//  await window.ethereum.enable();
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  updateConnectionStatus();
  return accounts;
}

export async function getGasPrice() {
  const price = await web3.eth.getGasPrice();
  return price;
}

var current_block;

export function new_block() {
  var wrapper = document.getElementById("wrapper");
  current_block = document.createElement("div");
  current_block.classList.add("log");
  wrapper.appendChild(current_block);
}

export function clear() {
  var wrapper = document.getElementById("wrapper");
  wrapper.innerHTML = "";
}

export function block_log(message) {
  current_block.innerHTML += "<p>" + message + "</p>";
  document.getElementById('screen').scrollTop = document.getElementById('screen').scrollHeight; //ensure input is visible
  document.getElementById("input_source").focus(); //ensure input gets focus
}

export async function updateConnectionStatus() {
  const walletDiv = document.getElementById("wallet_connection");
  if (window.ethereum && ethereum.isConnected() && ethereum.selectedAddress) {
    walletDiv.innerHTML = `--[${truncAddr(ethereum.selectedAddress,4)}]--`;
    walletDiv.style.cursor = 'default';
    walletDiv
      .removeEventListener("click", function () {
        ethereum.request({method:'eth_requestAccounts'}).then(updateConnectionStatus)
      });
  } else {
    walletDiv.innerHTML = "<span style='color:red;'>--[disconnected]--</span>";
    walletDiv.style.cursor = 'pointer';
    walletDiv
      .addEventListener("click", function () {
        ethereum.request({method:'eth_requestAccounts'}).then(updateConnectionStatus)
        .catch((error) => {
          console.error(`Wallet connection failed: ${error.message}`);
        })
      });
  }
}

export const ofInterest = ']08v';

function truncAddr(addr, limit) {
  if (addr.length <= (limit * 2)) {
    return addr;
  }
  var shortAddr = `${addr.substr(0,limit)}...${addr.substr(limit * -1)}`
  return shortAddr;
}

export const availKults = ['kult geheim','d0d engel','stalkroth','kult gor','klinge','dalk stracht','ys diaboli','grater djevel'];
export const dkScale = 1000000000000000000;

