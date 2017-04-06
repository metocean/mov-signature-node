# mov-signature-node
Node.js library for signing requests to MetOceanView (MOV).

## Usage

To install

```BASH
npm install --save mov-signature-node
```

To sign a request, you need to set the `Authorization` header. e.g.

```JS
const MOVSig = require('mov-signature-node')
const url = 'https://some.url/path'
fetch(url, {
  method: 'GET',
  headers: {
    Authorization: MOVSig.sign({
      httpMethod: 'GET',
      url: url,
      payload: '', 
      agentcode: 'your-agent-code',
      key: 'your-key'
    })
  }
})
```

```JS
const MOVSig = require('mov-signature-node')
const url = 'https://some.url/path'
const body = JSON.stringify({some: 'example-content'})
fetch(url, {
  method: 'POST',
  body: body,
  headers: {
    'Content-Type': 'application/json',
    Authorization: MOVSig.sign({
      httpMethod: 'GET',
      url: url,
      payload: body,
      agentcode: 'your-agent-code',
      key: 'your-key'
    })
  }
})
```

To get your `agentcode` and your `key`, please contact your MOV account manager.

## Signature

The header looks like this:

```
MOV1-HMAC-SHA256 Credential=[agentcode]/[ISO8601String] Signature=[signature]
```

The signature is calculated by first creating a `CanonicalRequest`

```
"[HTTPMethod]\n[URL]\n"+HEX(SHA256Hash([payload]))
```

Then a `StringToSign` is created using the `CanonicalRequest`

```
"MOV1-HMAC-SHA256\n[ISO8601String]\n"+HEX(SHA256Hash([CanonicalRequest])
```

Then we also need a `SigningKey`

```
HMAC-SHA256("MOV1 [ISO8601String]", [api-key])
```

Finally we can create the signature with

```
HEX(HMAC-SHA256([SigningKey], [StringToSign]))
```

If you're familiar with (how AWS signs requests)[https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html] this should feel somewhat familiar.




