import * as core from "@actions/core";
import axios from "axios";
import * as jwt from "jsonwebtoken";

type Payload = {
  exp: number;
  iat: number;
  iss: string;
};

const payload: Payload = {
  exp: Math.floor(Date.now() / 1000) + 60,
  iat: Math.floor(Date.now() / 1000) - 10,
  iss: core.getInput("app_id"),
};
const private_key: string = core.getInput("private_key");
console.log(private_key)

const token: string = jwt.sign(payload, private_key, { algorithm: "RS256" });

axios
  .get(
    "https://api.github.com/app/installations",
    {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github.machine-man-preview+json",
      },
    }
  ).then((res) => {
    const installationId = res.data[0].id
    console.log('installationId: ' + installationId)

    axios
      .post(
        "https://api.github.com/app/installations/" +
          installationId +
          "/access_tokens",
        null,
        {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/vnd.github.machine-man-preview+json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        core.setOutput("token", res.data.token);
    });
  })