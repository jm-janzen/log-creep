import express from 'express'
import { getFiles } from './src/get-files.js'


const PORT = 9002

const app = express()

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.get('/get-files', (req, res) => {
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

app.listen(PORT, () => {
    console.info(`I'm up: localhost:${PORT}`)
})