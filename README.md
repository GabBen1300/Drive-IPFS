# Drive-IPFS

Login with MetaMask, WalletConnect or Username/Password Upload and share file on IPFS Unlimited storage space

## Installation

First you need to have a [Moralis](https://moralis.io/) account and create a server, 
change [ApplicationID](https://raw.githubusercontent.com/GabBen1300/Drive-IPFS/main/scripts/init.js) and [ServerUrl](https://raw.githubusercontent.com/GabBen1300/Drive-IPFS/main/scripts/init.js)
with yours.

```bash
const serverUrl = "YOUR SERVER URL";
const appId = "YOUR APPLICATION ID";
Moralis.start({ serverUrl, appId });
```
Then put the file on a web server or hosting, plus you also need to install the [MetaMask extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) to be able to log in with it

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
