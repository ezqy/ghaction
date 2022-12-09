import * as core from "@actions/core";
import axios from "axios";
//import * as sodium from "libsodium-wrappers"
const sodium = require("libsodium-wrappers")

let value: string = core.getInput("value");
const action_repository: string = core.getInput("action_repository");
const token: string = core.getInput("token");
const key: string = core.getInput("key")

if(key == "PRIVATE_KEY"){
  value = Buffer.from(core.getInput("value"),'base64').toString()
  // value = core.getInput("value").replace(/\n/g, '\\n')
}

console.log(value)

axios
  .get(
    "https://api.github.com/repos/" +
      action_repository +
      "/actions/secrets/public-key",
    {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json"
      },
    }
  )
  .then((res) => {
    const key_id = res.data.key_id
    sodium.ready.then(() => {
      // https://docs.github.com/ja/rest/actions/secrets?apiVersion=2022-11-28#create-or-update-a-repository-secret
      // Convert Secret & Base64 key to Uint8Array.
      let binkey = sodium.from_base64(res.data.key, sodium.base64_variants.ORIGINAL)
      let binsec = sodium.from_string(value)
    
      //Encrypt the secret using LibSodium
      let encBytes = sodium.crypto_box_seal(binsec, binkey)
    
      // Convert encrypted Uint8Array to Base64
      let output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)

      axios
        .put(
          "https://api.github.com/repos/" +
          action_repository +
          "/actions/secrets/" + 
          key,
          {
            encrypted_value: output,
            key_id: key_id
          },
          {
            headers: {
              Authorization: "Bearer " + token,
              Accept: "application/vnd.github+json"
            },
          }
        )
    })
  });
