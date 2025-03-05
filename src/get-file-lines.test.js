import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { getFileLines } from './get-file-lines.js'
import { vol } from 'memfs'


jest.mock('fs')

beforeEach(() => {
    process.env.BASE_DIR = '/fakes'
    vol.reset()
})

describe('getFileLines', () => {
    it('should return matching line (1 line at end)', async () => {
        vol.fromJSON({
            '/fakes/cat.log': 'meow meow meow',
            '/fakes/cats.log': 'meow meow meow',
            '/fakes/cata.log': 'meeeeeeeooooow',
            '/fakes/empty.log': '',
        })

        const res = new Response()
        res.write = jest.fn()

        await getFileLines('cat.log', 1, 'meow', res)
        expect(res.write).toHaveBeenCalledWith('meow meow meow\n')
    })
    it('should return matching lines (in correct order)', async () => {
        vol.fromJSON({ '/fakes/cat.log': '1: meow\n2: meow' })

        const res = { write: jest.fn() }

        await getFileLines('cat.log', 2, 'meow', res)
        expect(res.write).toHaveBeenNthCalledWith(1, '2: meow\n')
        expect(res.write).toHaveBeenNthCalledWith(2, '1: meow\n')
    })
    it('should return matching lines (top of file only)', async () => {
        vol.fromJSON({ '/fakes/cat.log':
            '1: meow\n' +
            '2: woof\n' +
            '3: oink\n' +
            '4: hoot\n' +
            '5: bark\n' +
            '6: grrr\n' +
            '7: hiss\n'
        })

        const res = { write: jest.fn() }

        await getFileLines('cat.log', 2, 'meow', res)
        expect(res.write).toHaveBeenNthCalledWith(1, '1: meow\n')
        expect(res.write.mock.calls.length).toEqual(1)
    })
    it('should return matching lines (case sensitive)', async () => {
        vol.fromJSON({ '/fakes/cat.log':
            '1: Meow\n' +
            '2: MEow\n' +
            '3: MEOW\n' +
            '4: MEOw\n' +
            '5: MEow\n' +
            '6: Meow\n' +
            '7: meow\n'
        })

        const res = { write: jest.fn() }

        await getFileLines('cat.log', 2, 'MEOW', res)
        expect(res.write).toHaveBeenNthCalledWith(1, '3: MEOW\n')
        expect(res.write.mock.calls.length).toEqual(1)
    })
    it('return matching lines (up to numLines)', async () => {
        vol.fromJSON({ '/fakes/cat.log': '1: meow\n2: meow' })

        const res = { write: jest.fn() }

        await getFileLines('cat.log', 1, 'meow', res)
        expect(res.write).toHaveBeenNthCalledWith(1, '2: meow\n')
        expect(res.write.mock.calls.length).toEqual(1)
    })
    it('should return no matches found', async () => {
        vol.fromJSON({ '/fakes/cat.log': '1: meow\n2: meow' })

        const res = { write: jest.fn() }

        await getFileLines('cat.log', 100, 'WOOF', res)
        expect(res.write.mock.calls.length).toEqual(0)
    })
    it('should throw on bad path', async () => {
        vol.fromJSON({ '/fakes/nothere.log': '' })

        try {
            await getFileLines('here.log', 1, '', undefined)
        } catch (e) {
            expect(e.message).toEqual("Invalid path: 'here.log'")
            expect(e.statusCode).toEqual(404)
        }
    })
    it('should return matching line (in correct order)', async () => {
        vol.fromJSON({ '/fakes/cat.log': '' })
        const res = { status: jest.fn() }

        await getFileLines('cat.log', 2, 'meow', res)
        expect(res.status).toHaveBeenCalledWith(204)
    })
})
