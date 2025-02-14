import fs from 'fs'


export async function getFileLines(filePath, numLines, match) {
    const { BASE_DIR } = process.env
    const fullPath = `${BASE_DIR}/${filePath}`
    const size = fs.statSync(fullPath).size
    const fd = fs.openSync(fullPath)
    const matchingLines = []

    return new Promise((resolve) => {
        let text = ''
        let start = size
        while (start > 0) {
            const length = Math.min(64 * 1024, start)
            const buffer = Buffer.alloc(length)

            start = start - length

            fs.readSync(fd, buffer, { start, length })

            text = buffer + text

            console.log(`Reading from ${start} to ${start + length} out of ${size}`, {text})

            const lines = text.split('\n')

            // Save incomplete line back on to our text 'buffer' (not a real buffer)
            text = lines.shift()

            while (lines.length) {
                const line = lines.pop()

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
