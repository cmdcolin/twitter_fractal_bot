import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import OAuth from 'oauth'
import fetch from 'node-fetch'

dotenv.config()
;(async () => {
  try {
    const oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.API_KEY as string,
      process.env.API_SECRET as string,
      '1.0A',
      null,
      'HMAC-SHA1',
    )
    const sig = oauth.authHeader(
      'https://api.twitter.com/2/tweets',
      process.env.TOKEN as string, // oauth_token (user access token)
      process.env.TOKEN_SECRET as string, // oauth_secret (user secret),
      'post',
    )
    const response = await fetch('https://api.twitter.com/2/tweets', {
      headers: {
        Authorization: sig,
        'user-agent': 'v3CreateTweetJS',
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ text: 'Hello world 5!' }),
      method: 'post',
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`HTTP ${response.status} ${text}`)
    }
    const result = await response.json()
    console.log(result)
  } catch (e) {
    console.error(e)
  }
})()
