import fs from 'fs'
import * as dotenv from 'dotenv'
import OAuth from 'oauth'
import fetch, { RequestInit } from 'node-fetch'
import { FormData, File } from 'formdata-node'

const form = new FormData()

async function mfetch(url: string, params: RequestInit) {
  const response = await fetch(url, params)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`HTTP ${response.status} ${text}`)
  }
  return response.json() as Promise<Record<string, unknown>>
}

function getAuth(oauth: OAuth.OAuth, url: string) {
  return oauth.authHeader(
    url,
    process.env.TOKEN as string,
    process.env.TOKEN_SECRET as string,
    'post',
  )
}

const { minX, maxX, minR, maxR } = JSON.parse(
  fs.readFileSync('test.json', 'utf8'),
)
const file = new File([fs.readFileSync('test.resized.png')], 'test.resized.png')
form.set('media', file)

dotenv.config()
;(async () => {
  try {
    const client = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.API_KEY as string,
      process.env.API_SECRET as string,
      '1.0A',
      null,
      'HMAC-SHA1',
    )

    const picEndpoint = 'https://upload.twitter.com/1.1/media/upload.json'
    const tweetEndpoint = 'https://api.twitter.com/2/tweets'
    const clientName = 'v3CreateTweetJS'

    const r = await mfetch(picEndpoint, {
      headers: {
        Authorization: getAuth(client, picEndpoint),
        'user-agent': clientName,
      },
      method: 'POST',
      //@ts-ignore
      body: form,
    })

    const result = await mfetch(tweetEndpoint, {
      headers: {
        Authorization: getAuth(client, tweetEndpoint),
        'user-agent': clientName,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        media: { media_ids: [r.media_id_string] },
        text: `min_x=${minX},max_x=${maxX},min_r=${minR},max_r=${maxR}`,
      }),
      method: 'post',
    })

    console.log(result)
  } catch (e) {
    console.error(e)
  }
})()
