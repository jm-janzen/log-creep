import fs from 'fs'


export async function getFileLines(filePath, numLines, match) {
    const { BASE_DIR } = process.env
    const fullPath = `${BASE_DIR}/${filePath}`
    const size = fs.statSync(fullPath).size
    const fd = fs.openSync(fullPath)
    const matchingLines = []

    // TODO Actually loop over file from bottom up
    return new Promise((resolve) => {
        let start = size
        while (start > 0) {
            const length = 32
            const buffer = Buffer.alloc(length)

            start = start - length

            fs.readSync(fd, buffer, { start, length })

            const text = buffer.toString()

            console.log(`Reading from ${start} to ${start + length} out of ${size}`, {text})

            const lines = text.split('\n')

            for (const line of lines) {
                if (!match || line.includes(match)) {
                    matchingLines.push(line)
                }

                if (matchingLines.length >= numLines) {
                    return resolve(matchingLines)
                }
            }
        }

        resolve(matchingLines)
    })

}
