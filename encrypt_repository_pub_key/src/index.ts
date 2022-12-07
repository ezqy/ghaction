import * as core from "@actions/core";
import axios from "axios";
import * as crypto from "crypto"

const value: string = core.getInput("value");
const action_repository: string = core.getInput("action_repository");
const token: string = core.getInput("token");

axios
  .post(
    "https://api.github.com/repos/" +
      action_repository +
      "/actions/secrets/public-key",
    null,
    {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json",
        "X-Github-Api-Version": "2022-11-28"
      },
    }
  )
  .then((res) => {
    console.log(res.data);
    const encrypted_value = crypto.publicEncrypt(res.data.key,Buffer.from(value))
    console.log(encrypted_value)
    core.setOutput("encrypted_value", encrypted_value);
  });
