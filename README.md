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

