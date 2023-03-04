# RazdCaptionCrater


Team Raz Captcha Crater 
ETHDenver 2023 Scroll Bounty Candidate

This Dapp allows you to create Captchas and deploy them.
You can think of this as a parody of NFTs.  
Or you can think of a Captcha as a generic example of some company specific digital widget to be distributed.


We have two payment options:

1. Where you create a Captcha on your phone and make a Scroll payment to deploy it.
Here the Javascript browser client uses the Web3.js library and MetaMask Wallet extension to make a payment to a smart contract.


2. Where you get paid for submitting your Captcha.  In this case a Server based service accepts the Capcha, validates it and sends Payment via a Geth Node residing on the same server. At the time of submission we were having trouble syncronizing the Geth wallet with the network. So, we removed this option from the UI.





