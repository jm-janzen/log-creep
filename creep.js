import express from 'express'
import { getFiles } from './src/get-files.js'
import { getFileLines } from './src/get-file-lines.js'


const { PORT = 9002, BASE_DIR = '/var/log' } = process.env

const app = express()

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.get('/get-files', (req, res) => {
    // TODO Add includeDirs query param
    // or maybe just another endpoint for dirs, idk
    const { path = '/', match = '' } = req.query
    const items = getFiles(path, match)

    res.send({
        data: {
            kind: 'files',
            items,
        }
    })
})

app.get('/get-file-lines', async (req, res) => {
    const { path = '/', numLines = 1, match } = req.query

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Connection': 'keep-alive',
    })
    res.flushHeaders()

    await getFileLines(path, Number(numLines), match, res)
    res.end()
})

app.listen(PORT, () => {
    console.info(`I'm up at: localhost:${PORT}`)
    console.info(`Serving from: ${BASE_DIR}`)
})
