import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      name: "Exam DAO contract",
      voting_token_address: "0x77471347642551f42724479961d066ba8ef7815c",

      voting_delay_in_blocks: 0, //when can members start voting after a proposal is created
      voting_period_in_blocks: 6570, //1 day = 7650 blocks, time for voting
      voting_quorum_fraction: 0, //minimum % of total supply that need to vote for the proposal to be valid
      proposal_token_threshold: 0, //min # of tokens to create a proposal
    });

    console.log(
      "✅ Successfully deployed vote contract, address:",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Failed to deploy vote contract", err);
  }
})();