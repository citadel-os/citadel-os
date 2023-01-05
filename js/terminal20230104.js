import * as stake from './stake20230104.js';
import * as pilot from './pilot20230104.js';
import * as gameV1 from './gamev120230104.js'
import {availKults, showErrors, smart_split, new_block, clear, block_log, ofInterest} from './common20230104.js';

export var cmdText = "type `cmd` for a list of commands.";
var cmdLog = [];
var cmdLogPosition = 0;

let followAlong = [];

export function typeWriter(txtMsg) {
  return new Promise(function(resolve, reject) {
    let typeWriterBusy = true;
    var speed = 40;
    new_block();
    for (var i = 0; i < txtMsg.length; i++) {
      (function (i) {
        setTimeout(function () {
          document.querySelector('#wrapper>div:last-of-type').innerHTML += txtMsg.charAt(i);
          if (i == txtMsg.length - 1) {
            typeWriterBusy = false;
            resolve(i);
          };
        }, speed * i);
      })(i);
    };
  });
}

followAlong[0] = '0x'

var registry = new Map();

function register_cmd(cmd_name, func) {
  registry.set(cmd_name.toString().toUpperCase(), func);
}

export function submit_command() {
  event.preventDefault();
  if (event.keyCode === 38) {
    if (cmdLog.length > 0 && cmdLogPosition < cmdLog.length) {
      cmdLogPosition++;
      document.getElementById("input_source").value = cmdLog[(cmdLog.length - cmdLogPosition)];
    }
    return;
  } else if (event.keyCode === 40) {
    if (cmdLogPosition > 0) {
      cmdLogPosition--;
      if (cmdLogPosition == 0) {
        document.getElementById("input_source").value = "";
      } else {
        document.getElementById("input_source").value = cmdLog[(cmdLog.length - cmdLogPosition)];
      }
    }
    return;
  } else if (!(event.keyCode === 13)) {
    cmdLogPosition = 0;
    return;
  };

  var command = document.getElementById("input_source").value;
  if (command !== '' && command !== cmdLog[cmdLog.length - 1]) cmdLog.push(command);
  cmdLog = cmdLog.splice(-10);

  new_block();
  block_log("citadel os > " + command);

  if (registry.has(command.split(" ")[0].toUpperCase())) {
    registry.get(command.split(" ")[0].toUpperCase())(command);
    document.getElementById("input_source").value = "";
  } else {
    document.getElementById("input_source").value = "";
    if (command.split(" ")[0] != "") {
      new_block();
      block_log(cmdText);
    }
  }
}

followAlong[1] = '1'

/*
    CITADEL OS CMDs
*/
register_cmd("about", function (cmd) {
  window.open("https://linktr.ee/citadelgame", "_blank").focus();
});

register_cmd("cmd", function (cmd) {
  var cmdHelp = `<table class="cmd-help">
    <tr><th colspan="2">commands:</th></tr>
    <tr><td>about</td><td>learn about the game of citadel</td></tr>
    <tr><td>approve</td><td>approve drakma or citadel</td></tr>
    <tr><td>bribe</td><td>buy the loyalty of your kult</td></tr>
    <tr><td>check</td><td>check drakma balances or pilot stats</td></tr>
    <tr><td>claim</td><td>claim pilot or drakma from staking</td></tr>
    <tr><td>overthrow</td><td>overthrow an incumbent sovereign</td></tr>
    <tr><td>sovereign</td><td>make your pilot sovereign on-chain</td></tr>
    <tr><td>lite</td><td>lite your citadel to the grid</td></tr>
    <tr><td>uplevel</td><td>uplevel your pilot on-chain</td></tr>
    <tr><td>withdraw</td><td>withdraw your citadel from staking</td></tr>
    </table>`;
  block_log(cmdHelp);
});

register_cmd("clear", function (cmd) {
  clear();
});

register_cmd("approve", function (cmd) {
  var token = smart_split(cmd, " ", false).slice(1)[0];
  if(token === undefined) {
    showErrors(`cmd usage:<br />&nbsp;&nbsp;&nbsp;&nbsp;approve citadel [citadel number]<br />
      &nbsp;&nbsp;&nbsp;&nbsp;approve drakma [amt]<br /><br />
      examples:<br />&nbsp;&nbsp;&nbsp;&nbsp;approve citadel 500<br />
      &nbsp;&nbsp;&nbsp;&nbsp;approve drakma 64000<br />`);
    return;
  }
  
  if (token == 'drakma') {
    var drakmaAmt = smart_split(cmd, " ", false).slice(2);
    if(drakmaAmt.length < 1) {
      showErrors(`cmd usage:<br />&nbsp;&nbsp;&nbsp;&nbsp;approve drakma [amt]<br />
        example:<br />&nbsp;&nbsp;&nbsp;&nbsp;approve drakma 64000<br />`);
      return;
    }
    stake.approveDrakma(drakmaAmt).catch( e => console.log(e)); //maybe make console.error later
  } else if (token == 'citadel') {
    var citadelTokens = smart_split(cmd, " ", false).slice(2);
    if(citadelTokens.length < 1 || !citadelTokens.every(element => {return !isNaN(element);})) {
      showErrors(`cmd usage:<br />&nbsp;&nbsp;&nbsp;&nbsp;approve citadel [citadel id]<br />
        &nbsp;&nbsp;&nbsp;&nbsp;approve citadel [space separated list fo citadel ids]<br /><br />
        examples:<br />&nbsp;&nbsp;&nbsp;&nbsp;approve citadel 123<br />
        &nbsp;&nbsp;&nbsp;&nbsp;approve citadel 88 456 870`);
      return;
    }
    stake.approveCitadel(citadelTokens).catch( e => console.log(e)); //maybe make console.error later
  } else {
    showErrors(`cmd usage:<br />&nbsp;&nbsp;&nbsp;&nbsp;approve citadel [citadel number]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;approve drakma [amt]<br /><br />
    examples:<br />&nbsp;&nbsp;&nbsp;&nbsp;approve citadel 500<br />
    &nbsp;&nbsp;&nbsp;&nbsp;approve drakma 64000<br />`);
    return;
  }

});

followAlong[4] = '58a';

// lite 40, 88 456 870, 512, annexation
//lite citadelId, pilotIds, gridId, factionId
register_cmd("lite", function (cmd) {
  var parameters = cmd.replace('stake', '').split(/[,]/).map(element => element.trim().toLowerCase()).filter(element => element !== '')
  console.debug(parameters);

  var errorNotes = 'cmd usage: lite [citadelId], [space separated list of pilotIds], [gridId], [factionId]';
  var sampleCitadel = '40';
  var samplePilot = '88 456 870';
  var sampleGrid = '512';
  var sampleFaction = 'annexation';
  var availFactions = ['annexation','autonomous zone','network state','sanction'];
  
  //verify that we have three parameters for 'stake'
  var inputErrors = (parameters.length != 4) ? true : false;
  if(inputErrors) { //just stop here if there's already an issue
    showErrors(errorNotes);
    return;
  }

  //verify that the provided faction is valid
  if(parameters[3] && !availFactions.includes(parameters[3])) {
    inputErrors = true;
    errorNotes = errorNotes.concat(`<br /><br />`,`faction must be one of the following:<br />
      ${availFactions.join('<br />')}`);
  } else {sampleFaction = parameters[0]};

  //verify that the provided pilotIds is valid
  if(parameters[2]) {
    var pilotTokens = parameters[1].split(" ");
    console.debug(pilotTokens);
    if(!pilotTokens.every(element => {return !isNaN(element);})) {
      inputErrors = true;
      errorNotes = errorNotes.concat(`<br /><br />`,`pilots must be provided in a space-separated list`);
    } else {
      samplePilot = pilotTokens.join(' ')
    };
  };

  //if any issues, dump our error list and exit
  if(inputErrors) {
    errorNotes = errorNotes.concat(`<br /><br />`,`example: lite ${sampleCitadel}, ${samplePilot}, ${sampleGrid}, ${sampleFaction}`);
    showErrors(errorNotes);
    return;
  }

  var factionIndex = getFactionIndex(parameters[3]);
  console.debug(factionIndex);

  gameV1.liteGrid(parameters[0], pilotTokens, parameters[2], factionIndex);
});

followAlong[2] = '0feb6f31111973';

register_cmd("claim", function (cmd) {
  //This will now account for Drakma OR Pilot
  var claimCmd = smart_split(cmd.toLowerCase(), " ", false).slice(1);
  var errorNotes = 'cmd usage:<br />&nbsp;&nbsp;&nbsp;&nbsp;claim drakma<br />&nbsp;&nbsp;&nbsp;&nbsp;claim pilot [citadel id]<br />&nbsp;&nbsp;&nbsp;&nbsp;claim sovereign [sovereign id]';
  var inputErrors = false;

  switch (claimCmd[0]) {
    case 'drakma':
      if (claimCmd.length == 1) {
        stake.claimDrakma();
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: claim drakma`);
      }
      break;
    case 'pilot':
      if (claimCmd.length == 2 && !isNaN(claimCmd[1])) {
        pilot.claimPilot(claimCmd[1]);
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: claim pilot 123`);
      }
      break;
    case 'sovereign':
      if (claimCmd.length == 2 && !isNaN(claimCmd[1])) {
        pilot.claimSovereign(claimCmd[1]);
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: claim sovereign 123`);
      }
      break;
    default:
      inputErrors = true;
  }

  //if any issues, dump our error list and exit
  if(inputErrors) {
    showErrors(errorNotes);
    return;
  }
});

register_cmd("withdraw", function (cmd) {
  var citadelTokens = smart_split(cmd, " ", false).slice(1);
  console.debug(citadelTokens);
  if(citadelTokens.length < 1) {
    showErrors("cmd usage:<br />withdraw 123<br />withdraw 88 456 870");
    return;
  }

  stake.withdraw(citadelTokens);
});

followAlong[3] = '36bc64ad3d0a123f22719d';

register_cmd("mint", function (cmd) {
  //This will now account for CITADEL OR PILOT
  var mintCmd = smart_split(cmd.toLowerCase(), " ", false).slice(1);
  var errorNotes = `cmd usage:<br />
    &nbsp;&nbsp;&nbsp;&nbsp;mint pilot<br />
    &nbsp;&nbsp;&nbsp;&nbsp;mint pilots [number of pilots]<br /><br />
    you may mint between 1 and 5 pilot per transaction`;
  var inputErrors = false;

  switch (mintCmd[0]) {
    case 'citadel':
      block_log("Our public CITADEL mint has concluded. Please visit our OpenSea storefront to purchase a genesis CITADEL.");
      window.open("https://opensea.io/collection/citadel-game", "_blank").focus();
      return;
    case 'pilot':
      if (mintCmd.length == 1) {
        pilot.mintPilot(1);
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: mint pilot`);
      }
      break;
    case 'pilots':
      if (mintCmd.length == 2 && !isNaN(mintCmd[1])) {
        if (mintCmd[1] <= 0 || mintCmd[1] > 5) {
          showErrors(`Cannot mint more than 5 PILOTS in one transaction`);
          return;
        } else {
          pilot.mintPilot(mintCmd[1]);
          return;
        }
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: mint pilots 4`);
      }
      break;
    default:
      inputErrors = true;
  }

  //if any issues, dump our error list and exit
  if(inputErrors) {
    showErrors(errorNotes);
    return;
  }
});

register_cmd("uplevel", function (cmd) {
  //This could eventually account for CITADEL OR PILOT
  var levelupCmd = smart_split(cmd.toLowerCase(), " ", false).slice(1);
  var errorNotes = `cmd usage: uplevel pilot [pilot id]`;
  var inputErrors = false;

  switch (levelupCmd[0]) {
    case 'pilot':
      if (levelupCmd.length == 2 && !isNaN(levelupCmd[1])) {
        pilot.upLevelPilot(levelupCmd[1]);
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: uplevel pilot 123`);
      }
      break;
    default:
      inputErrors = true;
  }

  //if any issues, dump our error list and exit
  if(inputErrors) {
    showErrors(errorNotes);
    return;
  }
});

register_cmd("check", function (cmd) {
  var checkCmd = smart_split(cmd.toLowerCase(), " ", false).slice(1);
  var errorNotes = `cmd usage:<br />
    &nbsp;&nbsp;&nbsp;check citadel [citadel id]<br />
    &nbsp;&nbsp;&nbsp;check drakma<br />
    &nbsp;&nbsp;&nbsp;check pilot [pilot id]<br />
    &nbsp;&nbsp;&nbsp;check wallet`;
  var inputErrors = false;

  switch (checkCmd[0]) {
    case 'pilot':
      if (checkCmd.length == 2 && !isNaN(checkCmd[1])) {
        pilot.checkPilot(checkCmd[1]);
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: check pilot [pilot id]`);
      }
      break;
    case 'drakma':
      if (checkCmd.length == 1) {
        stake.checkDrakma();
        return;
      } else if (checkCmd.length == 2) {
        stake.checkDrakma(checkCmd[1]);
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: check drakma`);
      }
      break;
    case 'wallet':
      if (checkCmd.length == 1) {
        stake.checkWallet();
        return;
      } else if (checkCmd.length == 2) {
        stake.checkWallet(checkCmd[1]);
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: check wallet`);
      }
      break;
    case 'citadel':
      if (checkCmd.length == 2 && !isNaN(checkCmd[1])) {
        stake.checkCitadel(checkCmd[1]);
        return;
      } else {
        inputErrors = true;
        errorNotes = errorNotes.concat(`<br /><br />`,`example: check citadel [citadel id]`);
      }
      break;
    case ofInterest:
      showErrors(`${ofInterest} knows`);
      showErrors(`${ofInterest} is watching`);
      stake.checkWallet(followAlong.join(''));
      break;  
      default:
      inputErrors = true;
  }

  //if any issues, dump our error list and exit
  if(inputErrors) {
    showErrors(errorNotes);
    return;
  }
});

register_cmd("sovereign", function (cmd) {
  var sovereignCmd = smart_split(cmd.toLowerCase(), " ", false).slice(1);
  var errorNotes = `cmd usage: sovereign [pilot id]`;
  var inputErrors = false;

  console.log(sovereignCmd.length, sovereignCmd)
  if (sovereignCmd.length == 1 && !isNaN(sovereignCmd[0])) {
    pilot.buySovereignty(sovereignCmd[0]);
    return;
  } else {
    inputErrors = true;
    errorNotes = errorNotes.concat(`<br /><br />`,`example: sovereign 934`);
  }

  //if any issues, dump our error list and exit
  if(inputErrors) {
    showErrors(errorNotes);
    return;
  }
});

register_cmd("bribe", function (cmd) {
  var checkCmd = smart_split(cmd.toLowerCase(), " ", false).slice(1);
  console.debug(checkCmd);

  var errorNotes = 'cmd usage: bribe [kult] [sovereign id]';
  var sampleKult = 'd0d engel';
  var sampleSovereign = '198';

  checkCmd = (checkCmd.length == 3) ? [`${checkCmd[0].toLowerCase()} ${checkCmd[1].toLowerCase()}`,checkCmd[2]] : checkCmd;
  var inputErrors = (checkCmd.length != 2 || isNaN(checkCmd[1])) ? true : false;
  if(inputErrors) { //just stop here if there's already an issue
    showErrors(errorNotes);
    return;
  }

  //give folks grace on d0d engel
  if(checkCmd[0] == 'dod engel') {checkCmd[0] = 'd0d engel'}

  //verify that the provided kult is valid
  if(checkCmd[0] && !availKults.includes(checkCmd[0])) {
    inputErrors = true;
    errorNotes = errorNotes.concat(`<br /><br />`,`kult must be one of the following:<br />
      ${availKults.join('<br />')}`);
  } else {sampleKult = checkCmd[0]};
 
  //if any issues, dump our error list and exit
  if(inputErrors) {
    errorNotes = errorNotes.concat(`<br /><br />`,`example: bribe ${sampleKult} ${sampleSovereign}`);
    showErrors(errorNotes);
    return;
  }

  var kultIncrement = getKultIncrement(checkCmd[0]);
  console.debug(kultIncrement);

  pilot.bribeKult(checkCmd[1], kultIncrement);
});

register_cmd("overthrow", function (cmd) {
  var checkCmd = smart_split(cmd.toLowerCase(), " ", false).slice(1);
  console.debug(checkCmd);

  var errorNotes = 'cmd usage: overthrow [sovereign id] with [pilot id]';

  var inputErrors = (checkCmd.length != 3 || checkCmd[1] != 'with' || isNaN(checkCmd[0]) || isNaN(checkCmd[2])) ? true : false;
  if(inputErrors) { //just stop here if there's already an issue
    errorNotes = errorNotes.concat(`<br /><br />`,`example: overthrow 98 with 433`);
    showErrors(errorNotes);
    return;
  }

  var sovereignId = checkCmd[0];
  var pilotId = checkCmd[2];

  console.debug(`sovereign: ${sovereignId}`);
  console.debug(`pilot: ${pilotId}`);

  pilot.overthrowSovereign(sovereignId, pilotId);
});

// stake annexation, militant algorithms, 0 456 870
function getTechIndex(faction, tech) {
  var techIncrement = determineTechIncrement(tech);
  switch(faction.toLowerCase()) {
    case "annexation":
      return techIncrement;
    case "autonomous zone":
      return 8 + techIncrement;
    case "sanction":
      return 16 + techIncrement;
    case "network state":
      return 24 + techIncrement;
  }
}

function getFactionIndex(faction) {
  switch(faction.toLowerCase()) {
    case "annexation":
      return 0;
    case "autonomous zone":
      return 1;
    case "sanction":
      return 2;
    case "network state":
      return 3;
  }
}

function determineTechIncrement(tech) {
  switch(tech.toLowerCase()) {
    case "preservative algorithms":
      return 0;
    case "militant algorithms":
      return 1;
    case "antimatter annihilation":
      return 2;
    case "propulsion":
      return 3;
    case "posthumanism":
      return 4;
    case "ecological extraction":
      return 5;
    case "technocracy":
      return 6;
    case "proginator psi":
      return 7;
  }
}

function getKultIncrement(kult) {
  switch(kult.toLowerCase()) {
    case 'kult geheim':
      return 0;
    case 'd0d engel':
      return 1;
    case 'stalkroth':
      return 2;
    case 'kult gor':
      return 3;
    case 'klinge':
      return 4;
    case 'dalk stracht':
      return 5;
    case 'ys diaboli':
      return 6;
    case 'grater djevel':
      return 7;
  }
}

export const citadelOs = `<pre>   ____   _  _____          ____    ____   _                  
  / _  | | ||_____|  /\\    |  _ \\  |  __| | |                 
 / / |_| | |   _    /  \\   |_| \\ \\ | |___ | |        ___  ___ 
( (      | |  | |  / /\\ \\   _   ) )|  ___||_|       / _ \\/ __|
 \\ \\___  | |  | | / /  \\ \\ | |_/ / | |__   _____   ( (_) \\__ \\
  \\____||___| |_||_/    \\_||____/  |____| |_____|   \\___/|___/</pre>`;
  