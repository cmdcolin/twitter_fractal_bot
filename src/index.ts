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
const r = () => 200 + Math.floor(Math.random() * 55)
const opacity = 0.5 * Math.random() * Math.random()
function getLightColor() {
  return `rgba(${r()},${r()},${r()},${opacity})`
}

const width = 5000
const height = 3500

// select somewhere to the right of the fractal (x-axis)
const minR = 3.5 + Math.random() * 0.5
const maxR = minR + (4 - minR) * Math.random() * Math.random()

// use logistic formula warmup to find a point that is within the fractal
const warmup = Math.pow(1.5, Math.log(1 / (maxR - minR))) * 1000
let p = Math.random()
for (let i = 0; i < Math.max(warmup, 10000); i++) {
  p = minR * p * (1 - p)
}
const minX = p
const maxX = minX + (1 - minX) * Math.random() * Math.random()
const vert = Math.random() > 0.75
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')
const M = 100000
const N = 10000
const bg = getDarkColor()
const fg = getLightColor()
ctx.fillStyle = bg
ctx.fillRect(0, 0, width, height)
ctx.fillStyle = fg
drawCanvas(ctx, width, height, minR, maxR, minX, maxX, vert, M, N)
const out = fs.createWriteStream('test.png')
const stream = canvas.createPNGStream()
fs.writeFileSync(
  'test.json',
  JSON.stringify({ minX, maxX, minR, maxR, N, M, fg, bg, vert }, null, 2),
)
//@ts-ignore
stream.pipe(out)
out.on('finish', () => console.log('The PNG file was created.'))
