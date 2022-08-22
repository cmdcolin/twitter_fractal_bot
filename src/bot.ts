import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import OAuth from 'oauth'

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

    oauth.post(
      'https://api.twitter.com/2/tweets',
      process.env.TOKEN as string, // oauth_token (user access token)
      process.env.TOKEN_SECRET as string, // oauth_secret (user secret)
      { text: 'lol' },
      'application/json', // post content type ?
      function (err, data, res) {
        if (err) {
          console.error(err)
        } else {
          console.log(data)
        }
      },
    )
  } catch (e) {
    console.error(e)
  }
})()
