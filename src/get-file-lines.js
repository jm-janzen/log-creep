import fs from 'fs'


export async function getFileLines(filePath, numLines = 0, match = '') {
    const { BASE_DIR } = process.env
    const fullPath = `${BASE_DIR}/${filePath}`
    const size = fs.statSync(fullPath).size
    const options = {
        start: 0,
        end: size,
    }
    const matchingLines = []

    // TODO Actually loop over file from bottom up
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(fullPath, options)


        stream.on('error', (error) => {
            stream.close

            reject(error)
        })

        stream.on('data', (chunk) => {

            const lines = chunk.toString().split('\n')

            for (const line of lines) {
                console.log(`Checking if ${match} matching ${line}`)
                if (!match) {
                    matchingLines.push(line)
                } else if (line.includes(match)) {
                    matchingLines.push(line)
                }

                if (matchingLines.length >= numLines) {
                    resolve(matchingLines)
                    return
                }
            }

        })

        stream.on('close', () => {
            resolve(matchingLines)
        })
    })

}
