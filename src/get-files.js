import fs from 'fs'


// TODO Build and return "file" objects, with metadata
export function getFiles(path = '/', pattern) {
    const { BASE_DIR } = process.env
    // TODO Check if dir, else throw err
    // TODO Ensure dir not escaping BASE_DIR (sneaky /../../ for example)
    return fs.readdirSync(`${BASE_DIR}/${path}`)
        // TODO Check if RegExp safe
        // TODO Filter out dirs? Maybe just note...
        .filter(fileName => RegExp(pattern).test(fileName))
}