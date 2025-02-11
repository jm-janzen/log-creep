import fs from 'fs'


export function getFileLines(filePath, numLines = 0, pattern) {
    const { BASE_DIR } = process.env

    // TODO Actually handle large files efficiently
    return fs
        .readFileSync(`${BASE_DIR}/${filePath}`)
        .toString()
        .split(/\n/)
        .filter(line => RegExp(pattern).test(line)) // FIXME This is horribly, horribly inefficient
        .slice(numLines * -1)
        .reverse()
}