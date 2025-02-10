import fs from 'fs'


export function getFiles(path = '/', pattern) {
    const { BASE_DIR } = process.env
    return fs.readdirSync(`${BASE_DIR}/${path}`)
        .filter(fileName => RegExp(pattern).test(fileName))
}