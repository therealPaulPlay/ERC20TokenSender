# ERC20TokenSender
A simple ERC20 Token sender / balance viewer using the Alchemy SDK and ethers.js with a css/html interface. Use it as a website with Webpack. 

First, run ```npm install``` to install all dependencies.

Run ```npm run build``` in the terminal to build with webpack. The build will be found inside the "build" folder. 

Replace the API_KEY in the .env file with your Alchemy API Key. Don't forget to set the recipient's address, the tokenAddress as well as the amount of tokens you want to transfer in the code. Lastly, make sure to select the network (blockchain) you are using. The default is the Polgyon (Matic) Blockchain.
