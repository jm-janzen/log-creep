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
    const { path = '/', match = '' } = req.query
    const items = getFiles(path, match)

    res.send({
        data: {
            kind: 'files',
            match,
            items,
            path,
        }
    })
})

app.get('/get-file-lines', async (req, res) => {
    const { path = '/', numLines, match } = req.query
    const items = await getFileLines(path, numLines, match)

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