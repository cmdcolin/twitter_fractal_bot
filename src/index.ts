import fs from 'fs'
import { createCanvas } from 'canvas'
import drawCanvas from './drawCanvas.js'

const r = () => 200 + Math.floor(Math.random() * 80)
const s = () => Math.floor(Math.random() * 55)
const opacity = Math.random() * Math.random()

function getDarkColor() {
  return `rgb(${s()},${s()},${s()})`
}
function getLightColor() {
  return `rgba(${r()},${r()},${r()},${opacity})`
}

const width = 5000
const height = 3500

function makeRandomDrawing() {
  const iterx = Math.random() * 5 + 1
  const itery = iterx + (Math.random() * 2 - 1)

  // select somewhere to the right of the fractal (x-axis)
  const minR = 3.5 + Math.random() * 0.5
  const maxR = minR + (4 - minR) * Math.pow(Math.random(), iterx)

  // use logistic formula warmup to find a point that is within the fractal
  const warmup = Math.pow(1.5, Math.log(1 / (maxR - minR))) * 1000
  let p = Math.random()
  for (let i = 0; i < Math.max(warmup, 10000); i++) {
    p = minR * p * (1 - p)
  }
  const minX = p
  const maxX = minX + (1 - minX) * Math.pow(Math.random(), itery)
  const vert = Math.random() > 0.75
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const M = 200000
  const N = 10000
  const bg = getDarkColor()
  const fg = getLightColor()
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = fg
  const pointsDrawn = drawCanvas(
    ctx,
    width,
    height,
    minR,
    maxR,
    minX,
    maxX,
    vert,
    M,
    N,
  )
  return { canvas, pointsDrawn, minX, maxX, minR, maxR, N, M, fg, bg, vert }
}

let attempts = 0
let params = makeRandomDrawing()
while (attempts < 10 && params.pointsDrawn < 500000) {
  console.log("Didn't draw enough points, retrying attempt " + attempts++)
  params = makeRandomDrawing()
}

const out = fs.createWriteStream('test.png')
const stream = params.canvas.createPNGStream()
const { canvas, pointsDrawn, ...rest } = params
fs.writeFileSync('test.json', JSON.stringify(rest, null, 2))
stream.pipe(out)
out.on('finish', () => console.log('The PNG file was created.'))
