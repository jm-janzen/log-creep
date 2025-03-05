import { describe, it, expect, beforeEach, afterAll } from '@jest/globals'
import { getFiles } from './get-files.js'
import mockFs from 'mock-fs'

beforeEach(() => {
    process.env.BASE_DIR = 'fakes'
    mockFs({
        'fakes': {},
    })
})

afterAll(() => {
    mockFs.restore()
})

describe('getFiles', () => {
    it('should get empty dir', () => {
        mockFs({
            'fakes': {},
        })

        const actual = getFiles('')

        expect(actual).toEqual([])
    })
    it('should get file name', () => {
        mockFs({
            'fakes': {
                'empty.log': '',
            },
        })

        const actual = getFiles('')

        expect(actual).toEqual(['empty.log'])
    })
    it('should get nested file name', () => {
        mockFs({
            'fakes': {
                'unreal': {
                    'empty.log': '',
                },
            },
        })

        const actual = getFiles('unreal')

        expect(actual).toEqual(['empty.log'])
    })
    it('should get nested file name (with path seperators)', () => {
        mockFs({
            'fakes': {
                'unreal': {
                    'empty.log': '',
                },
            },
        })

        const actual = getFiles('/unreal/')

        expect(actual).toEqual(['empty.log'])
    })
    it('should get matching files', () => {
        mockFs({
            'fakes': {
                'cat.log': 'meow meow meow',
                'cats.log': 'meow meow meow',
                'cata.log': 'meeeeeeeooooow',
                'empty.log': '',
            },
        })

        const actual = getFiles('/', 'cat')

        expect(actual).toEqual(['cat.log', 'cata.log', 'cats.log'])
    })
    it('should fail to get matching file', () => {
        mockFs({
            'fakes': {
                'cats.log': 'meow meow meow',
                'empty.log': '',
            },
        })

        const actual = getFiles('/', 'dogs')

        expect(actual).toEqual([])
    })
    it('should throw on no entry', () => {
        mockFs({
            'foo': {},
        })

        const expected = Error("ENOENT, no such file or directory 'fakes/bar'")

        expect(() => getFiles('bar')).toThrow(expected)
    })
})
