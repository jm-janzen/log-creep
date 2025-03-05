import fs from 'fs'


export function getFiles(path = '/', match = '') {
    const { BASE_DIR } = process.env
    const fullPath = `${BASE_DIR}/${path}`
    // TODO Check if dir, else throw err
    // TODO Ensure dir not escaping BASE_DIR (sneaky /../../ for example)
    return fs.readdirSync(fullPath)
        .filter(fileName => fileName.includes(match))
        .map(fileName => {
            return fs.lstatSync(`${fullPath}/${fileName}`).isDirectory()
            ? fileName + '/'
            : fileName
        })
}
