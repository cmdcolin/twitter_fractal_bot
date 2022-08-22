import fs from 'fs'
import { createCanvas } from 'canvas'
import drawCanvas from './drawCanvas.js'

const width = 5000
const height = 3500
const minX = 0
const maxX = 1
const minR = 2
const maxR = 4
const vertical = false
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')
const M = 1000
const N = 50000
ctx.fillStyle = 'white'
ctx.fillRect(0, 0, width, height)
ctx.fillStyle = 'black'
drawCanvas(ctx, width, height, minR, maxR, minX, maxX, vertical, M, N)
const out = fs.createWriteStream('test.png')
const stream = canvas.createPNGStream()

//@ts-ignore
stream.pipe(out)
out.on('finish', () => console.log('The PNG file was created.'))
