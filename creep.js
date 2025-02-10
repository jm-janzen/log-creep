import express from 'express'


const PORT = 9002

const app = express()

app.get('/v1/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.listen(PORT, () => {
    console.info(`I'm up: localhost:${PORT}`)
})