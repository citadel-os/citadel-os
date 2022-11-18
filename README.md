# CITADEL OS

## Management Commands:

### `approve [citadelID]`

Allow citadel OS to interact with one of your CITADEL, `citadelID`

> ### Future
>
> To be explicit, I suggest we update this to add / parse an additional arguement
> `approve citadel [citadelId]` v. `approve drakma`
>
> ?Does the later need an amount of DRAKMA?

<br />

### `stake [faction], [techBranch], [citadelIDs]`

Align your CITADEL(s), one or a space-separated list of, to a faction and tech research branch

**NOTE** Any/all CITADEL(s) must already have access granted by `approve`

> ### Valid Factions
>
> * `annexation`
> * `autonomous zone`
> * `network state`
> * `sanction`

> ### Valid Tech Research Branches
>
> * `antimatter annihilation`
> * `ecological extraction`
> * `militant algorithms`
> * `posthumanism`
> * `preservative algorithms`
> * `proginator psi`
> * `propulsion`
> * `technocracy`

<br>

### `claim drakma`

Move earned DRAKMA to your wallet

### `claim pilot [citadelId]`

Claim a PILOT from your genesis CITADEL, `citadelId`

**NOTE** Can only `claim` from staked CITADEL(s)

### `withdraw [citadelIDs]`

Return your citadel(s), one or a space-separated list of, to your wallet

**NOTE** Upon `withdraw` any/all CITADEL(s) must have rights granted again by `approve` before a subsequent `stake`

### `mint pilot`

Mint a genesis PILOT

### `mint pilots [1-5]`

Mint up to five genesis PILOTS

### `levelup pilot [pilotId]`

Level-up your PILOT, `pilotId`

### `buy sovereignty [pilotId]`

Buy the SOVEREIGNTY of your PILOT, `pilotId`

### `check drakma`

Check DRAKMA balances of current connected wallet

### `check drakma [wallet]`

Check DRAKMA balances of `wallet`

### `check pilot [pilotId]`

Check PILOT stats of `pilotId`

### `overthrow [sovereignId] with [pilotId]`

Attempt to overthrow a incumbent SOVEREIGN, `sovereignId`, with one of your PILOTs, `pilotId`

### `bribe [kult] [sovereign id]`

Buy the loyalty of your KULT with your SOVEREIGN, `sovereignId`

> ### Valid KULTs
>
> * `dalk stracht`
> * `d0d engel` OR `dod engel`
> * `grater djevel`
> * `klinge`
> * `kult geheim`
> * `kult gor`
> * `stalkroth`
> * `ys diaboli`

<br>

## Information Commands:

### `about`

Display information about the citadel game

### `art`

Experience the custom artwork exclusive to the game

### `demo`

Watch a demo of the gameplay

### `drakma`

Display information about the in-game currency

### `exordium`

Learn about the citadel pre-game

<br />

---
python -m SimpleHTTPServer 8000