import fs from 'fs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { createCanvas } from 'canvas'

import drawCanvas from './drawCanvas.js'

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
    default: 'white',
  })
  .option('bg', {
    describe: 'background color',
    default: 'black',
  })
  .help().argv

console.log({ argv })

const { min_x, max_x, min_r, max_r, fg, bg, width, height, N, M } = argv
console.log({ min_x })
const vert = false
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')
drawCanvas(ctx, width, height, min_r, max_r, min_x, max_x, vert, M, N)
const out = fs.createWriteStream('test.png')
const stream = canvas.createPNGStream()

//@ts-ignore
stream.pipe(out)
out.on('finish', () => console.log('The PNG file was created.'))
