import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x77471347642551F42724479961d066bA8eF7815c"); //ERC-20 contract address

(async () => {
  try {
    const amount = 1000; //max supply
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    console.log("✅ There now is", totalSupply.displayValue, "$HOKAGE in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();