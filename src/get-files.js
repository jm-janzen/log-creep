import fs from 'fs'


export function getFiles(path = '/', match = '') {
    const { BASE_DIR } = process.env
    // TODO Check if dir, else throw err
    // TODO Ensure dir not escaping BASE_DIR (sneaky /../../ for example)
    return fs.readdirSync(`${BASE_DIR}/${path}`)
        // TODO Filter out dirs? Maybe just note...
        .filter(fileName => fileName.includes(match))
}