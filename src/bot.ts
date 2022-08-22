import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import fetch from 'node-fetch'

//@ts-ignore
import OAuth from 'oauth'

dotenv.config()
;(async () => {
  var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.API_KEY,
    process.env.API_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1',
  )
  console.log('posting')

  try {
    const url = 'https://api.twitter.com/2/tweets'
    const nonce = `${Math.random()}`
    const parameters = {
      oauth_consumer_key: process.env.API_KEY,
      oauth_token: process.env.TOKEN,
      oauth_nonce: nonce,
      oauth_timestamp: `${+Date.now()}`,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
    }
    console.log({ parameters })
    const sig = oauthSignature.generate(
      'post',
      url,
      parameters,
      process.env.API_SECRET,
      process.env.TOKEN_SECRET,
    )
    console.log({ sig })

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ text: 'ello world' }),
      headers: {
        Authorization: `OAuth oauth_consumer_key="${
          process.env.API_KEY
        }", oauth_nonce="${nonce}", oauth_signature="${sig}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${+Date.now()}", oauth_token="${
          process.env.TOKEN
        }", oauth_version="1.0"`,
        'user-agent': 'v3CreateTweetJS',
        'content-type': 'application/json',
        accept: 'application/json',
      },
    })
    if (!response.ok) {
      let val = await response.text()
      throw new Error(`HTTP ${response.status} ${response.statusText} ${val}`)
    }
  } catch (e) {
    console.error(e)
  }
})()
