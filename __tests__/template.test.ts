import { promises } from 'fs'
import { join } from 'path'

const TEMPLATES_DIR = join(process.cwd(), 'templates')

const listDirectoriesInPath = async (path: string) => {
    try {
        return promises.readdir(path)
    } catch (err) {
        console.error('Error occured while reading directory', err)
    }
}

const fileExists = async (path: string) => {
    try {
        await promises.access(path)
        return true
    } catch {
        return false
    }
}

const readJsonFile = async (path: string) => {
    try {
        const rawFile = await promises.readFile(path)
        return JSON.parse(rawFile.toString())
    } catch (err) {
        console.error('Error occured while reading file', err)
    }
}

describe('HTML Templates', () => {
    it('Validates that each folder contains necessary files', async () => {
        const TEMPLATE_DIRS = await listDirectoriesInPath(TEMPLATES_DIR)

        if (!TEMPLATE_DIRS) throw Error('Issue reading files')

        const filesExistance = await Promise.all(
            TEMPLATE_DIRS.map(async (template_dir) => {
                const indexFilePath = join(process.cwd(), 'templates', template_dir, 'index.html')
                const metaJsonFilePath = join(process.cwd(), 'templates', template_dir, 'meta.json')

                const hasIndexFile = await fileExists(indexFilePath)
                const hasMetaFile = await fileExists(metaJsonFilePath)

                return [hasIndexFile, hasMetaFile]
            })
        ).then((data) => data.flat())

        const allNecessaryFilesExist = filesExistance.every((item) => item === true)

        expect(allNecessaryFilesExist).toBe(true)
    })
    it('Validates that "meta.json" has required keys', async () => {
        const TEMPLATE_DIRS = await listDirectoriesInPath(TEMPLATES_DIR)

        if (!TEMPLATE_DIRS) throw Error('Issue reading files')

        const metaFiles = await Promise.all(
            TEMPLATE_DIRS.map(async (template_dir) => {
                const metaJsonFilePath = join(process.cwd(), 'templates', template_dir, 'meta.json')
                const metaFileContent: Object = await readJsonFile(metaJsonFilePath)

                const hasTitle = metaFileContent.hasOwnProperty('title')
                const hasPublic = metaFileContent.hasOwnProperty('public')
                const hasTestData = metaFileContent.hasOwnProperty('test_data')

                return [hasTitle, hasPublic, hasTestData]
            })
        ).then((data) => data.flat())

        const allNecessaryKeysExist = metaFiles.every((item) => item === true)

        expect(allNecessaryKeysExist).toBe(true)
    })
})
