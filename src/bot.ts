import fs from 'fs'
import * as dotenv from 'dotenv'
import OAuth from 'oauth'
import fetch, { RequestInit } from 'node-fetch'
import { FormData, File } from 'formdata-node'

dotenv.config()

function p(r: number) {
  return r.toPrecision(5)
}

const form = new FormData()
form.set(
  'media',
  new File([fs.readFileSync('test.resized.png')], 'test.resized.png'),
)

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
    process.env.ACCESS_TOKEN as string,
    process.env.ACCESS_TOKEN_SECRET as string,
    'post',
  )
}

const { vert, bg, fg, minX, maxX, minR, maxR, N, M } = JSON.parse(
  fs.readFileSync('test.json', 'utf8'),
) as {
  minX: number
  maxX: number
  minR: number
  maxR: number
  vert: boolean
  bg: string
  fg: string
  N: number
  M: number
  opacity: number
}

const url =
  `https://cmdcolin.github.io/logistic_chaos_map/?wasm=false&minX=${minX}&maxX=${maxX}&minR=${minR}&maxR=${maxR}&N=${N}&M=${M}&animate=true&vert=${vert}&scaleFactor=2&bg=${bg}&fg=${fg}`
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\#/g, '%23')

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
        text: `min_x=${p(minX)},max_x=${p(maxX)},min_r=${p(minR)},max_r=${p(
          maxR,
        )},diff_x=${p(maxX - minX)},diff_r=${p(maxR - minR)} ${url}`,
      }),
      method: 'post',
    })

    console.log(result)
  } catch (e) {
    console.error(e)
  }
})()
