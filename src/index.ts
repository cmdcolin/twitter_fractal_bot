import fs from 'fs'
import { createCanvas } from 'canvas'
import drawCanvas from './drawCanvas.js'

const width = 500
const height = 500
const minX = 2
const maxX = 4
const minR = 0
const maxR = 1
const vertical = false
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')
const M = 1000
const N = 50000
drawCanvas(ctx, width, height, minR, maxR, minX, maxX, vertical, M, N)
const out = fs.createWriteStream('test.png')
const stream = canvas.createPNGStream()

//@ts-ignore
stream.pipe(out)
out.on('finish', () => console.log('The PNG file was created.'))
