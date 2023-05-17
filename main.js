import css from "./main.css";
import { Network, Alchemy, Wallet, Utils, BigNumber } from "./node_modules/alchemy-sdk";
import { ethers } from "./node_modules/ethers";


//make sure to set your api key in the .env file! Use npm run build to build a web version inside the build folder.
const settings = {
  apiKey: process.env.API_KEY,
  network: Network.MATIC_MAINNET, //choose your network
};

const alchemy = new Alchemy(settings);

const recipientAddress = "Recipient address"; //the address of the person who should receive the transaction
const TokenContractAddress = "Your token address"; //your token address

document.getElementById("timeout").style.visibility = 'hidden';

async function getHBalance() {
  //get balance
  const tokenbal = await alchemy.core.getTokenBalances(document.getElementById("address").value, [TokenContractAddress]);
  let bal = JSON.stringify(tokenbal);
  bal = bal.substring(bal.indexOf('tokenBalance":"') + 15)
  bal = bal.split('"}')[0];
  console.log(bal);
  console.log("Account Balance: " + ethers.formatUnits(bal, 18) + " Crypto");
  document.getElementById("TokensLeft").innerHTML = "You have " + ethers.formatUnits(bal, 18) + " Crypto left.";

}

let mainEnabled = true;

async function main() {

  if (mainEnabled) {
  document.getElementById("timeout").style.visibility = 'visible';

  mainEnabled = false;
  sendAnimationStart();

  //create new wallet
  const wallet = new Wallet(document.getElementById("prvkey").value, alchemy)
  const abi = ["function transfer(address to, uint256 value)"];
  const amountToSend = BigNumber.from("30000000000000000000000"); //set this to the amount to send with the decimals according to your token! Mine has 18 decimals -> 30000 + 18 zeros = 30 thousand
  console.log(Number(amountToSend) * (10 ** (-18)));

  const iface = new Utils.Interface(abi);
  const data = iface.encodeFunctionData("transfer", [recipientAddress, Utils.parseUnits(amountToSend.toString(), "wei"),]);

  //get gas values
  const feeData = await alchemy.core.getFeeData();
  console.log("Max fee for gas: " + feeData.maxFeePerGas);
  console.log("Gas estimate: " + feeData.gasPrice);

  const transaction = {
    to: TokenContractAddress,
    nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
    maxPriorityFeePerGas: feeData.maxFeePerGas, // This is the fee that the miner will get - WORKAROUND!
    maxFeePerGas: feeData.maxFeePerGas, // This is the maximum fee that you are willing to pay should be feedata.maxFeePerGas
    type: 2, // EIP-1559 transaction type
    chainId: 137, // Corresponds to POlYGON_MAINNET
    data: data, // encoded data for the transaction
    gasLimit: Utils.parseUnits("250000", "wei"), // normal 250.000 - this causes error?
  };

  // Send the transaction and log it.
  const sentTx = await wallet.sendTransaction(transaction);
  console.log(sentTx);

  await sentTx.wait();

  sendAnimationEnd();

  getHBalance();

  
//this is so that you can't spam the action, this can however be removed along with the mainEnabled boolean.
setTimeout(function(){
  mainEnabled = true;
  document.getElementById("timeout").style.visibility = 'hidden';
}, 5000); 

  }

}
//hide private key input field after clicking the confirm button!
function hide() {
  var x = document.getElementById("prvkey");
  x.setAttribute("type", "hidden");
  //get initial balance after you hide the bar (so the address should be entered.
  document.getElementById("prvkeytext").innerHTML = "The private key is set.";
  getHBalance();
  console.log("hidden");
}

console.log("Main.js is loaded. Token address: " + TokenContractAddress);
document.getElementById("prvkey").value = "Private key";


//button handlers
document.getElementById("Hide").addEventListener("click", hide);


document.getElementById("Send").addEventListener("click", main);

//if you want to trigger the transaction by a button press, you can do so here.

/*document.body.addEventListener ("keyup", (event) => {
	if (event.code == "KeyA") {
		console.log ("Key A pressed");
    main();
	}
}); */

//send animation
function sendAnimationStart () {
  document.body.style.transitionDuration = "250ms";
  document.body.style.backgroundColor = "#269456";
}

function sendAnimationEnd () {
  document.body.style.backgroundColor = "#242424";
}
