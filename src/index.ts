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

// select somewhere to the right of the fractal (x-axis)
const minR = 3.5 + Math.random() * 0.5
const maxR = minR + (4 - minR) * Math.random()

// use logistic formula warmup to find a point that is within the fractal
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
const M = 500000
const N = 20000
ctx.fillStyle = getDarkColor()
ctx.fillRect(0, 0, width, height)
ctx.fillStyle = '#fff2'
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
