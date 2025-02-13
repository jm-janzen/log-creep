import fs from 'fs'


// BUG Won't find 'match' if it's on the first line of the file
export async function getFileLines(filePath, numLines = 0, match = '') {
    const { BASE_DIR } = process.env
    const fullPath = `${BASE_DIR}/${filePath}`

    const length = 10
    const size = fs.statSync(fullPath).size
    const matchingLines = []

    return new Promise((resolve, reject) => {

        let text = ''
        let start = size - Math.min(size, length)
        let end = size
        while (start >= 0) {

        console.log(`Reading from ${start} to ${end} out of ${size}`)
        const stream = fs.createReadStream(fullPath, { start, end })

        stream.on('error', (error) => {
            stream.close

            reject(error)
        })

        stream.on('data', (chunk) => {

            text += chunk
            const lines = text.split('\n')
            text = lines.shift()

            for (const line of lines) {
                console.log(`Checking if ${match} matching '${line}'. Remaining:`, text)
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

        start = start - Math.min(size, length)
        end -= length

        }
    })

}
