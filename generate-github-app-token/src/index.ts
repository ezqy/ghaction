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

//const private_key: string = core.getInput("private_key");
const private_key: string = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAyAEpMaAOwQ6TgUcLQfWG3VPaGL5m0jq6d3hB0jmdfB35wP/W
II8OOa3rTkohpn5/KxSoSVuaTc9xtYAnhBbkKlYYdTBiyCbXJxxtFErwlyQOCsoD
W1KZc+F1MQGM9zcwF/jK2pIgE3tOnAP3E6UUX/Gyf2ydCyM3g3UfgpvygbfxC+4A
xh024t9NSMxiQmA7Yq1tqrQvYPhKMWYnRTc7gMf73KyxAaDy/qFDbf5hY0PlLoqT
PSTD/FRsBQy1Xd0jq9s7YVGVX6cPihDh/vRQthK2DShUzxIuSdpFVilu3qTidgnr
yyjB6T7fZKLpVe61Msgr8FUuC/gNws9KqtM66wIDAQABAoIBABpwzNlap5iuLKHy
mnJl2yZ3Z2XOBhnU2cHhjBIWu9Mkw1fYep5jSyYk7+6xrjEsl/NCD91i1stimU29
W3wC6rcOGr2jX+vF9ruc7m64WYYhphmXC0qPaOoA7FVGNzSXfywsH+U1XDg3HPVT
MN7P/BmTAl4GJdzLExO18Cx8IVs0khX9zmbmCccfA5cK8caGLIfZG4nnxpQ8jI19
fnIhyiXYGdxfxfJIf/kRIW2wlZphF3pt5QIfGOEQQYDnGnMcYvqaOl6NjxMOBpMd
KXJ0j/cUdu0nAH5zXmkI36sXR7kQGJuS8ybfl9ETjNF4huw2xRDIKi1RXcfi8yOn
ElRv3EECgYEA8xEjfOPm//s4T6f6JPIu5qJW6XxJ9Mu+OBB+g5QlSDf/0pPzOXjC
RHgtae5eg2gkWzrm5iD42PcbUVovAIUBkFnvzqkGT7okeqIMWb+qPjhJsWP0Wliu
CKLe1BOFaxOVor2lHuMeI6paXdL5C4JuMerJeZ5NGV7l7MS99ASZu58CgYEA0qV1
/18gNgsWAmnJtKRYet30jgUv1ByUlMliNF4X+EJVSgI8HeK9hZXI33Fh1pDKYxTP
bFdhuWAyLFybLzoLYXk9xkj2AkKNaDJd/FJCMz2YYfvC0lpiWUobGLyk4I/4RUj0
FahfwPlMGlvY5QOOL2EiEPJt3oIHKn0s0XalvTUCgYEA1I7VSN8H4Czxtn7/uhVr
vFaUyIPfLMqLYv3RlQEVhU0rUxv8o/KdeEDb/fns/t8wg/NDflWxKBMX+ZFy7vJh
RrnPgxq+oTP3uKJDSKzalKSmlREC24sXTggX8r/LebLbtUBAyHz2m1vawJfBIDaE
ZPScEdXEOH6LdP0r29u2EKMCgYBYp/kczS2icVIHG/0gAVeYBtjJ+VbjAFBsusGR
ZtTR0SFSb9Rbg7Xehmcv2+mgw/nab8TJRZHE0r7rOuK5osVtdfjQ/p5D3zzi0OgL
rZddN5xuCOc7X30rNWxoIeWG+jE0//pzLxV2A7bLFUMZSEDMoiYTWeVyE+nuMRbu
5e/lzQKBgFoiDGptZ9UwAi4AdfEbTKanifeAC7OlgizQiix9CI6hHMH3jn8SdCfK
YLbhBW97U6is98Eso9pjC5Vr0DJ5i1yZr3pegpvUqEYk8kkcI7hckyEsHkudU4yC
j4XPTlmIjNUJWKYcWdeivgzx1oYYiTSvz4k34GqxGnAUtp2x6Rr3
-----END RSA PRIVATE KEY-----`

const token: string = jwt.sign(payload, private_key, { algorithm: "RS256" });

const installationId: string = core.getInput("installation_id");

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
