import express from 'express'
import { getFiles } from './src/get-files.js'
import { getFileLines } from './src/get-file-lines.js'


const PORT = 9002

const app = express()

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.get('/get-files', (req, res) => {
    // TODO Add includeDirs query param
    // or maybe just another endpoint for dirs, idk
    const { path = '/', pattern = '' } = req.query
    const items = getFiles(path, pattern)

    res.send({
        data: {
            kind: 'files',
            pattern,
            items,
            path,
        }
    })
})

app.get('/get-file-lines', (req, res) => {
    const { path = '/', numLines = '', pattern } = req.query
    const items = getFileLines(path, numLines, pattern)

    res.send({
        data: {
            kind: 'file-lines',
            items,
        }
    })
})

app.listen(PORT, () => {
    console.info(`I'm up: localhost:${PORT}`)
})