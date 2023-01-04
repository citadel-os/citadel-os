import * as spinner from './spinner20230104.js';
import {showErrors, showSuccess, getAccounts, getGasPrice, dkScale} from './common20230104.js';

import {abiCitadelGameV1} from './contracts/abi20230104.js';
import {CITADEL_GAMEV1, web3, apiKey, alchemy} from './contracts/addr20230104.js';

const citadelGameV1 = new web3.eth.Contract(abiCitadelGameV1, CITADEL_GAMEV1);
