import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0xd5bf06D61223f332B84986Eb7BD04413cE732a75");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Vote Badge",
        description: "This NFT will give you access to ExamDAO!",
        image: readFileSync("scripts/assets/alpaca007.jpeg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();