const moment = require('moment')
const SHA256 = require('crypto-js/sha256')
const SHA256HMAC = require('crypto-js/hmac-sha256')

const constructCanonicalRequest = ({httpMethod, url, payload}) => {
  return `${httpMethod}\n${url}\n${SHA256(payload)}`
}
const constructStringToSign = ({ts, canonicalRequest}) => {
  return `MOV1-HMAC-SHA256\n${ts}\n${SHA256(canonicalRequest)}`
}
const constructSigningKey = ({ts, key}) => {
  return SHA256HMAC(`MOV1 ${ts}`, key)
}
const constructSignature = ({signingKey, stringToSign}) => {
  return SHA256HMAC(stringToSign, signingKey)
}

const verifySignature = ({authorizationHeader, httpMethod, url, key, payload, now}) => {
  if (!now) {
    now = moment.utc()
  }
  const matches = /^MOV1-HMAC-SHA256 Credential=([^\/]+)\/([^ ]+) Signature=(.+)$/.exec(authorizationHeader)
  if (!matches) {
    return false
  }
  const agentcode = matches[1]
  const ts = matches[2]
  const signature = matches[3]
  const reqTS = moment(ts).utc()
  if (Math.abs(now.diff(reqTS, 'seconds')) > 300) {
    return false
  }
  const constructedSignature = constructSignature({
    stringToSign: constructStringToSign({
      ts,
      canonicalRequest: constructCanonicalRequest({
        httpMethod,
        url,
        payload
      })
    }),
    signingKey: constructSigningKey({
      ts,
      key
    })
  })
  const signatureGood = signature === constructedSignature.toString()
  return signatureGood ? agentcode : false
}
const sign = ({httpMethod, url, agentcode, key, payload, now}) => {
  if (!now) {
    now = moment.utc()
  }
  const ts = now.toISOString()
  const signature = constructSignature({
    stringToSign: constructStringToSign({
      ts,
      canonicalRequest: constructCanonicalRequest({
        httpMethod,
        url,
        payload
      })
    }),
    signingKey: constructSigningKey({
      ts,
      key
    })
  })
  return `MOV1-HMAC-SHA256 Credential=${agentcode}/${ts} Signature=${signature}`

}

module.exports = {
  sign,
  verifySignature
}

