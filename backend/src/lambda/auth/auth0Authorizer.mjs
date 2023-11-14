import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
// import { certificate } from '../../lambda/auth'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJDX1H/8O2prL7MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1rMXJreHgxdDd3aDZlNG8wLnVzLmF1dGgwLmNvbTAeFw0yMzEwMjkw
OTMyNDhaFw0zNzA3MDcwOTMyNDhaMCwxKjAoBgNVBAMTIWRldi1rMXJreHgxdDd3
aDZlNG8wLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMnnyP9MwOqDU3nOlsoohzUb6l2LAfrEyLt2kY1HqelEErEdcByIQGBJl5mx
MEivUJ2a3RLke6+3Ea6XTGsxlcxRle0oGyAdCgHNH0BITUTyLZ8UKSmphmfd3OGS
kowCHc2ssh0hgeOKmzTOKmxuAXF7Hcsignx+oQ1QE1ni1hvX/sQnZeG7SH8gKQFF
42QgJWMfRyDGXEwOH62W5r0klnvnBs3a+cJXtUeCl8+B+SQWd13yrvsbPMkyc82w
aE9rRF3JgmTb6Rscszj/EIwVtirfbIHhCAqeeIePees3lG/TWU2Aoh/rSmeK9H0f
GK/qvNeTAffoTw9/9FJsaT1c5J0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUgd8m6/HeIrwyzEtepc6Sz1VAtJwwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQDEsfqCMqF+Ke+TCoi3yqfzgPmCmJlTp6FGwXYwPcxs
dEQl8uwHoe20pduEUh2yEFSjrcCTgugdHImI+jFx5HRYg4RWr8B9uWTE8FQfgXlJ
3EnJKhq6EZPYEq3VEqA7KRnDUWP0Wj/lwgmk3jnqbTpK0U6MDM3rBH+Rj5O4ixzd
8Y1JsZeWS7TsqGcmd6wlwOcK/T3wUwiRGgRf7/0mHnr+KpN/e/NyL/QP+KeICofC
7C659yl2Fw2gT3Uqvg8Gp0Y0fZ+Aukox5oAmYkTN5oEuRgLm3dHu5Bn0xWJ5PM5V
pbWyKLkhf+tU6oljSawuZSdhoxNLaRjVpO8x4zpSHC7u
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
  return jwt;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
