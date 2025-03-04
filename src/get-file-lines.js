import fs from 'fs'


/**
 * Returns specified number of matching lines from given file.
 * If no 'match' specified, just return the number of lines specified,
 * up to the maximum number of lines in the file.
 *
 * Returns lines from the bottom of the file first.
 *
 * BUG If the file ends in a newline, and numLines=1 specified
 * without anything to match, then a blank line [""] will be returned.
 *
 * @param {string} filePath valid path starting with BASE_DIR
 * @param {number} numLines number of lines to return
 * @param {string} match text to match within lines (if any)
 * @returns {Promise<string[]|Error>}
 */
export async function getFileLines(filePath, numLines, match) {
    const { BASE_DIR } = process.env
    const fullPath = `${BASE_DIR}/${filePath}`
    const size = (await fs.promises.stat(fullPath)).size
    const fd = await fs.promises.open(fullPath)
    const matchingLines = []

    return new Promise(async (resolve) => {
        let text = ''
        let start = size
        while (start > 0) {
            const length = Math.min(64 * 1024, start)
            const buffer = Buffer.alloc(length)

            start -= length

            await fd.read(buffer, { position: start, length })

            // Shift incomplete line back on to our text 'buffer' (not a real buffer)
            // for next read (when we have a complete line)
            text = buffer + text
            const lines = text.split('\n')
            // If we're at the top of the file, we're not going to get any more
            // so don't shift it away
            if (start > 0) {
                text = lines.shift()
            }

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
