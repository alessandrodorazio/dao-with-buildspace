import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0xd5bf06D61223f332B84986Eb7BD04413cE732a75");

(async () => {
  try {

    const claimConditions = [{
      startTime: new Date(),
      maxQuantity: 50_000,
      price: 0,
      quantityLimitPerTransaction: 1,
      waitInSeconds: MaxUint256,
    }]

    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();