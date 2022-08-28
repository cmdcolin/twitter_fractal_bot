import fs from 'fs'
import { createCanvas } from 'canvas'
import drawCanvas from './drawCanvas.js'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))
  .option('min_x', {
    describe: 'min_x value',
    default: 0,
  })
  .option('max_x', {
    describe: 'max_x value',
    default: 1,
  })
  .option('min_r', {
    describe: 'min_r value',
    default: 2,
  })
  .option('max_r', {
    describe: 'max_r value',
    default: 4,
  })
  .option('N', {
    describe: 'N number of points in visible region to attempt to plot',
    default: 10000,
  })
  .option('M', {
    describe: 'M is the max iterations when trying to draw the N points',
    default: 200000,
  })
  .option('width', {
    default: 5000,
  })
  .option('height', {
    default: 5000,
  })
  .option('fg', {
    describe: 'foreground color',
  })
  .option('bg', {
    describe: 'background color',
  })
  .help().argv

console.log({ argv })

const r = () => 200 + Math.floor(Math.random() * 80)
const s = () => Math.floor(Math.random() * 55)
const opacity = 0.4 * Math.pow(Math.random(), 2)

function getDarkColor() {
  return `rgb(${s()},${s()},${s()})`
}
function getLightColor() {
  return `rgba(${r()},${r()},${r()},${opacity})`
}

const width = 5000
const height = 3500

const iterx = Math.random() * 5 + 1
const itery = Math.random() * 5 + 1

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
