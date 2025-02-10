import fs from 'fs'


export function getFileLines(filePath, numLines = 0) {
    const { BASE_DIR } = process.env

    // TODO Actually handle large files efficiently
    return fs
        .readFileSync(`${BASE_DIR}/${filePath}`)
        .toString()
        .split(/\n/)
        .slice(numLines * -1)
}