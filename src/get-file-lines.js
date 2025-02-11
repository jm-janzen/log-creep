import fs from 'fs'
import readline from 'readline'


export async function getFileLines(filePath, numLines = 0, match = '') {
    const { BASE_DIR } = process.env

    return new Promise((resolve, reject) => {
        const lines = []
        const stream = fs.createReadStream(`${BASE_DIR}/${filePath}`)
        // TODO Investigate if straight up buffer is preferrable
        const lr = readline.createInterface({ input: stream })

        lr.on('error', (error) => {
            stream.close

            reject(error)
        })

        lr.on('line', (line) => {
            // TODO Start from bottom?
            if (lines.length < numLines) {
                // TODO Handle case where no 'match' specified
                // Shouldn't have to check for substring on each line!
                if (line.includes(match)) {
                    lines.push(line)
                }
            } else {
                // TODO Check difference between this and rl.close()
                stream.close()

                resolve(lines)
            }

        })

        lr.on('close', () => {
            resolve(lines)
        })
    })

}
