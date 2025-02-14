import fs from 'fs'


/**
 *
 * @param {string} filePath valid path starting with BASE_DIR
 * @param {number} numLines number of lines to return
 * @param {string} match text to match within lines (if any)
 * @returns {Promise<string[]|Error>}
 */
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

            fs.readSync(fd, buffer, { position: start, length })

            // Shift incomplete line back on to our text 'buffer' (not a real buffer)
            // on to our text 'buffer' (not a real buffer) for next read (when we have
            // a complete line)
            text = buffer + text
            const lines = text.split('\n')
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
