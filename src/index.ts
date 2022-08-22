import fs from 'fs'
import { createCanvas } from 'canvas'
import drawCanvas from './drawCanvas.js'

function getDarkColor() {
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 5)
  }
  return color
}

const width = 5000
const height = 3500
// const minX = 0
// const maxX = 1
// const minR = 2
// const maxR = 4
// const minX = 0.75 + Math.random() * 0.25
const minR = 3.5 + Math.random() * 0.5
const maxR = minR + (4 - minR) * Math.random()

// use warmup to zoom in on an area of the fractal
const warmup = Math.pow(1.5, Math.log(1 / (maxR - minR))) * 1000
let p = Math.random()
for (let i = 0; i < Math.max(warmup, 10000); i++) {
  p = minR * p * (1 - p)
}
const minX = p
const maxX = minX + (1 - minX) * Math.random()
const vertical = false
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')
const M = 50000
const N = 5000
ctx.fillStyle = getDarkColor()
ctx.fillRect(0, 0, width, height)
ctx.fillStyle = 'white'
drawCanvas(ctx, width, height, minR, maxR, minX, maxX, vertical, M, N)
const out = fs.createWriteStream('test.png')
const stream = canvas.createPNGStream()
fs.writeFileSync(
  'test.json',
  JSON.stringify({ minX, maxX, minR, maxR }, null, 2),
)
//@ts-ignore
stream.pipe(out)
out.on('finish', () => console.log('The PNG file was created.'))
