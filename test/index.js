
const chai = require('chai')
const expect = chai.expect
const moment = require('moment')
const MOVSig = require('../index')

const agentcode = 'FakeAgent1'
const key = 'somelongrandomkeystringthatnoonewillbeabletoguesseveripromise'
const url = 'https://some.url/here'

describe('index', () => {
  describe('sign', () => {
    it('Uses a provided now', () => {
      const httpMethod = 'GET'
      const payload = ''
      const now = moment().utc()
      const result = MOVSig.sign({httpMethod, url, payload, agentcode, key, now})
      expect(result).to.be.a('string')
      const ts = result.match(/Credential=[^\/]+\/([^ ]+) /)[1]
      expect(ts).to.eql(now.toISOString())
    })
    it('Creates a now if no now is given', () => {
      const httpMethod = 'GET'
      const payload = ''
      const result = MOVSig.sign({httpMethod, url, payload, agentcode, key})
      expect(result).to.be.a('string')
      const ts = result.match(/Credential=[^\/]+\/([^ ]+) /)[1]
      expect(moment().utc().diff(ts, 'seconds')).to.be.below(2)
    })
    it('Returns a correctly formatted string', () => {
      const httpMethod = 'GET'
      const payload = ''
      const now = moment().utc()
      const result = MOVSig.sign({httpMethod, url, payload, agentcode, key, now})
      expect(result).to.be.a('string')
      expect(result).to.match(new RegExp(`^MOV1-HMAC-SHA256 Credential=FakeAgent1/${now.toISOString()} Signature=([a-z0-9]{64})$`))
    })
  })
  describe('verifySignature', () => {
    it('Uses a provided now', () => {
      const httpMethod = 'GET'
      const payload = ''
      const now = moment('2017-04-06T22:07:25.971Z').utc()
      const authorizationHeader = `MOV1-HMAC-SHA256 Credential=${agentcode}/${now.toISOString()} Signature=95a5dbbb7899604783f5c79c34d1ea618fc2f26fa6b16506e821dfb04334fff1`
      const result = MOVSig.verifySignature({authorizationHeader, httpMethod, url, payload, key, now})
      expect(result).to.be.a('string')
      expect(result).to.eql(agentcode)
    })
    it('Creates a now if no now is given', () => {
      const httpMethod = 'GET'
      const payload = ''
      const authorizationHeader = MOVSig.sign({httpMethod, url, payload, agentcode, key})
      const result = MOVSig.verifySignature({authorizationHeader, httpMethod, url, payload, key})
      expect(result).to.be.a('string')
      expect(result).to.eql(agentcode)
    })
    it('Returns false if signature doesn\'t match', () => {
      const httpMethod = 'GET'
      const payload = ''
      const now = moment('2017-04-06T22:07:25.971Z').utc()
      const authorizationHeader = `MOV1-HMAC-SHA256 Credential=${agentcode}/${now.toISOString()} Signature=95a5dbbb7899604783f5c79c34d1ea618fc2f26fa6b16506e821dfb04334fff2`
      const result = MOVSig.verifySignature({authorizationHeader, httpMethod, url, payload, key, now})
      expect(result).to.be.a('boolean')
      expect(result).to.eql(false)
    })
    it('Returns false if signature is malformatted', () => {
      const httpMethod = 'GET'
      const payload = ''
      const now = moment('2017-04-06T22:07:25.971Z').utc()
      const authorizationHeader = `MOV1-HMAC-SHA256 Credential=${agentcode} / ${now.toISOString()} Signature=95a5dbbb7899604783f5c79c34d1ea618fc2f26fa6b16506e821dfb04334fff1`
      const result = MOVSig.verifySignature({authorizationHeader, httpMethod, url, payload, key, now})
      expect(result).to.be.a('boolean')
      expect(result).to.eql(false)
    })
    it('Returns false if header is to old', () => {
      const httpMethod = 'GET'
      const payload = ''
      const now = moment('2017-04-06T20:07:25.971Z').utc()
      const authorizationHeader = `MOV1-HMAC-SHA256 Credential=${agentcode}/2017-04-06T22:07:25.971Z Signature=95a5dbbb7899604783f5c79c34d1ea618fc2f26fa6b16506e821dfb04334fff1`
      const result = MOVSig.verifySignature({authorizationHeader, httpMethod, url, payload, key, now})
      expect(result).to.be.a('boolean')
      expect(result).to.eql(false)
    })
  })
})



