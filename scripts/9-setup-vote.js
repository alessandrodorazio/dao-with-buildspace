import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0x82B40844cF5c59A836cD67bb7DA3d8259C35C5C0"); //governance contract
const token = sdk.getToken("0x77471347642551F42724479961d066bA8eF7815c");

(async () => {
  try {
    // Give treasury the power to mint additional token if needed.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    );
    process.exit(1);
  }

  //transfer 90% of the supply to voting contract
  try {
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
  } catch (err) {
    console.error("failed to transfer tokens to vote contract", err);
  }
})();