"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const axios_1 = require("axios");
const sodium = require("libsodium-wrappers");
const value = core.getInput("value");
const action_repository = core.getInput("action_repository");
const token = core.getInput("token");
axios_1.default
    .get("https://api.github.com/repos/" +
    action_repository +
    "/actions/secrets/public-key", {
    headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json"
    },
})
    .then((res) => {
    console.log(res.data);
    sodium.ready.then(() => {
        // Convert Secret & Base64 key to Uint8Array.
        let binkey = sodium.from_base64(res.data.key, sodium.base64_variants.ORIGINAL);
        let binsec = sodium.from_string(value);
        //Encrypt the secret using LibSodium
        let encBytes = sodium.crypto_box_seal(binsec, binkey);
        // Convert encrypted Uint8Array to Base64
        let output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
        console.log(output);
        core.setOutput("encrypted_value", output);
    });
});
