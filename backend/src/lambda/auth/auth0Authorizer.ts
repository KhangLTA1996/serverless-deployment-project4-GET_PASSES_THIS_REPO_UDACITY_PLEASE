import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-z040eegdv0z0nnhw.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

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
async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const _res = await Axios.get(jwksUrl, {
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "'true'",
    }
  });
  const keys = _res.data.keys;
  console.log('Token',_res.data, jwt);
  logger.info('Token123' + _res.data + ' and ' +  jwt, jwt);
  console.log('Token12345 ' + _res.data + ' and ' +  jwt);
  console.log("keys =>>>>>", _res.data.keys);
  console.log("jwt kid =>>>>>",  jwt?.header?.kid);

  const signKeys = keys.find((key: any) => key.kid === jwt.header.kid);
  console.log("signKeys =>>>>>", JSON.stringify(signKeys));

  if(!signKeys) throw new Error("Incorrect Keys");
  const pemDT = signKeys.x5c[0];
  const secret = `-----BEGIN CERTIFICATE-----\n${pemDT}\n-----END CERTIFICATE-----\n`;;

  const verifyToken = verify(token,secret, {algorithms: ['RS256']}) as JwtPayload;

  logger.info('Verify token', verifyToken);
  return verifyToken;
}

function getToken(authHeader: string): string {
  console.log(' adasdasd ' +  authHeader);
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')
  
  const split = authHeader.split(' ')
  const token = split[1]
  return token
}
