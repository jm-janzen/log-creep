import fs from 'fs'
import readline from 'readline'


export async function getFileLines(filePath, numLines = 0, match = '') {
    const { BASE_DIR } = process.env

    // TODO Actually handle large files efficiently
    return fs
        .readFileSync(`${BASE_DIR}/${filePath}`)
        .toString()
        .split(/\n/)
        .filter(line => line.includes(match)) // FIXME This is horribly, horribly inefficient
        .slice(numLines * -1)
        .reverse()
}