import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop("0xd5bf06D61223f332B84986Eb7BD04413cE732a75"); //ERC-1155 membership NFT contract
const token = sdk.getToken("0x77471347642551F42724479961d066bA8eF7815c"); //ERC-20 token address

(async () => {
  try {
    // Grab all the addresses of people who own our membership NFT
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0); //tokenId = 0

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
      );
      process.exit(0);
    }

    const airdropTargets = walletAddresses.map((address) => {
      const randomAmount = Math.floor(Math.random() * (100 - 10 + 1) + 10);
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets); //so passing toAddress and amount
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();