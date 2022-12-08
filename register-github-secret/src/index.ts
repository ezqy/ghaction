import * as core from "@actions/core";
import axios from "axios";
//import * as sodium from "libsodium-wrappers"
const sodium = require("libsodium-wrappers")

let value: string = core.getInput("value");
const action_repository: string = core.getInput("action_repository");
const token: string = core.getInput("token");
const key: string = core.getInput("key")

if(key == "PRIVATE_KEY"){
  const aa = "-----BEGIN RSA PRIVATE KEY -----\nMIIEogIBAAKCAQEApWO6GIOUdpL1P7aFdUy7bdbxExHOmBb7JY24up6F/6FGzgAK\nUJ9yHBXKqGluJgCXxzrO2y7cQfyFvIo9UfQ0JjOiAU7kwtnlliy6Ri+lBN+lRvK7\nJRt1cJ7+goH88gC9ZfbGVMzKNLeoF/p/c0wIoaXEi/QA5MlK5Xn38ko00vYVfWqm\nObYxBIl8iHFaKB0YK8NJe2VexjUHNYy2l60U5NBR6kG6O6QCnty6dbAetr9aFa7q\n9sOoF663B1q81/kmYqjMsG4leTbArH1BCtAZNpQhomy591/bn7Eo8QxKSCrJb3Zs\nO2F4MyqG4fpHzhVVgPzhtx+JYzmU7wUDFHFMFwIDAQABAoIBAELttYxgCv9k/xw2\nZ5GNaLfNaKdX6GvBuQZ8cIoMxpspD7cjawkvTQUyiF1YtPtp+AHmuXkXYIjPgOtI\nYgI9ObFP6bpvy8FSXkdEeGkYtMXhH0gzyCn/D6pwnPwBUHQ6emq9z4rXiOiGfd6e\nP19QIJoRtBUSvB3Zm5Z7oiwJfZD04BcOI8yMJORGIUImLC1TPiIDJPpadTMhykXn\nArF8qHpor4jbk6Wd0H2p3/WspMz7hiP2AzBEsNW2AwqIbws1WkAi8kIw86A88/Mw\nAgRQOy41UhPKtmX5SffypaHxktJLgEpQEfRITBFtrT81Okg+VfrayfjbxZGzIBEC\naU7qEbkCgYEA1jj8um7KwV1q43urws52HE8EhcKBSxbTp7W4kyUDAPpAjlpl6wUH\nU6bWUzchL2Kkopg7fmDGZ/1SHsbxQMslqhk7n9ESqu0zDPAWjPRoQTI0soN95g78\ngxGWF4P3qBRBvZr75WRlI8mtJQWC0M/vvxvBfn10MpLH1qxNLMFtOCMCgYEAxaTC\n6iyMRAJALygiFxR3laMu63A7CuoqYx9AGTYSH/jMOqlmD4Ie8i0aEc2CaSPRevZ3\nNOMOzE4SpceLsDKVcWdKRGeOKEPnKrRXcMaki4jGQI4TkujJbwi1cESiONqq8c7b\ndPMrUNpVJyAeOHomQtH90vzq4P+GC47w6510QX0CgYBo1NRgS21vOM7g6ZlBKJXF\n/qkg5/ErlM0YyiW75CXXKZ/DydsMKpbOSduiN11G+gfFBag/jQ4qv12bcBGJeqBA\n4D48VCzFdnRABZGTgtst5GrDXPOUTIsnfMitU0gzeU4+ggR42itgWwYfEtZUZx1U\nsTl8M9pUEV434HOXzkQrbwKBgFT7If/0hZ8cZKKiG/5Wg5CoqJz9FbX8t5sFLddp\nQ2PR42Z5vfN/HHU+5U2wUpmImCLJ5Lmtw4gfLa9wXGS3a0BmjC1bZWl0wOnAvzQz\nhT6l4bCSJmJti2cdlH4gVKwjgYsVSZFAmWhbaG+5RKU+CEOE7SGSNB/oXqeLn5V/\njyQ1AoGAdznnI1zXGP0w88PUn3Q/qtL9rNfOZbiHIufkGp6eoeKQjl6YpUOrRsCE\ns6xNvnhgD7wWSHstoIVM9ZZ1HG9ntt2/RbnG/W2/vWRkChdemtIyTDxQrg/m8oQJ\no2aru0cD9uoaL7ycUzW8RTghDXo8Aa3DusqCiT7ggnJxbvuwOLw=\n-----END RSA PRIVATE KEY-----"
  value = aa.replace(/\\n/g, '\n')
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
