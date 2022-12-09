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

const aa = "-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEApWO6GIOUdpL1P7aFdUy7bdbxExHOmBb7JY24up6F/6FGzgAK\nUJ9yHBXKqGluJgCXxzrO2y7cQfyFvIo9UfQ0JjOiAU7kwtnlliy6Ri+lBN+lRvK7\nJRt1cJ7+goH88gC9ZfbGVMzKNLeoF/p/c0wIoaXEi/QA5MlK5Xn38ko00vYVfWqm\nObYxBIl8iHFaKB0YK8NJe2VexjUHNYy2l60U5NBR6kG6O6QCnty6dbAetr9aFa7q\n9sOoF663B1q81/kmYqjMsG4leTbArH1BCtAZNpQhomy591/bn7Eo8QxKSCrJb3Zs\nO2F4MyqG4fpHzhVVgPzhtx+JYzmU7wUDFHFMFwIDAQABAoIBAELttYxgCv9k/xw2\nZ5GNaLfNaKdX6GvBuQZ8cIoMxpspD7cjawkvTQUyiF1YtPtp+AHmuXkXYIjPgOtI\nYgI9ObFP6bpvy8FSXkdEeGkYtMXhH0gzyCn/D6pwnPwBUHQ6emq9z4rXiOiGfd6e\nP19QIJoRtBUSvB3Zm5Z7oiwJfZD04BcOI8yMJORGIUImLC1TPiIDJPpadTMhykXn\nArF8qHpor4jbk6Wd0H2p3/WspMz7hiP2AzBEsNW2AwqIbws1WkAi8kIw86A88/Mw\nAgRQOy41UhPKtmX5SffypaHxktJLgEpQEfRITBFtrT81Okg+VfrayfjbxZGzIBEC\naU7qEbkCgYEA1jj8um7KwV1q43urws52HE8EhcKBSxbTp7W4kyUDAPpAjlpl6wUH\nU6bWUzchL2Kkopg7fmDGZ/1SHsbxQMslqhk7n9ESqu0zDPAWjPRoQTI0soN95g78\ngxGWF4P3qBRBvZr75WRlI8mtJQWC0M/vvxvBfn10MpLH1qxNLMFtOCMCgYEAxaTC\n6iyMRAJALygiFxR3laMu63A7CuoqYx9AGTYSH/jMOqlmD4Ie8i0aEc2CaSPRevZ3\nNOMOzE4SpceLsDKVcWdKRGeOKEPnKrRXcMaki4jGQI4TkujJbwi1cESiONqq8c7b\ndPMrUNpVJyAeOHomQtH90vzq4P+GC47w6510QX0CgYBo1NRgS21vOM7g6ZlBKJXF\n/qkg5/ErlM0YyiW75CXXKZ/DydsMKpbOSduiN11G+gfFBag/jQ4qv12bcBGJeqBA\n4D48VCzFdnRABZGTgtst5GrDXPOUTIsnfMitU0gzeU4+ggR42itgWwYfEtZUZx1U\nsTl8M9pUEV434HOXzkQrbwKBgFT7If/0hZ8cZKKiG/5Wg5CoqJz9FbX8t5sFLddp\nQ2PR42Z5vfN/HHU+5U2wUpmImCLJ5Lmtw4gfLa9wXGS3a0BmjC1bZWl0wOnAvzQz\nhT6l4bCSJmJti2cdlH4gVKwjgYsVSZFAmWhbaG+5RKU+CEOE7SGSNB/oXqeLn5V/\njyQ1AoGAdznnI1zXGP0w88PUn3Q/qtL9rNfOZbiHIufkGp6eoeKQjl6YpUOrRsCE\ns6xNvnhgD7wWSHstoIVM9ZZ1HG9ntt2/RbnG/W2/vWRkChdemtIyTDxQrg/m8oQJ\no2aru0cD9uoaL7ycUzW8RTghDXo8Aa3DusqCiT7ggnJxbvuwOLw=\n-----END RSA PRIVATE KEY-----"

const bb = aa.replace(/\\n/g, '\n')

//const token: string = jwt.sign(payload, private_key, { algorithm: "RS256" });
const token: string = jwt.sign(payload, bb, { algorithm: "RS256" });


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