import { readdir, access, readFile } from 'fs/promises'
import { join } from 'path'
import { parse, defaultConfig } from 'squirrelly'
import { registerFilters } from '../src/utils/filter'
const TEMPLATES_DIR = join(process.cwd(), 'templates')
import { TemplateObject } from 'squirrelly/dist/types/parse.js'
import { Filters } from '../src/types'

const listDirectoriesInPath = async (path: string) => {
    try {
        return readdir(path)
    } catch (err) {
        console.error('Error occured while reading directory', err)
    }
}

const fileExists = async (path: string) => {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}

const readJsonFile = async (path: string) => {
    try {
        const rawFile = await readFile(path)
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
    it('Validates that each HTML template parses successfully', async () => {
        /**
         * Register Filters
         */
        registerFilters(Object.keys(Filters))

        const TEMPLATE_DIRS = await listDirectoriesInPath(TEMPLATES_DIR)

        if (!TEMPLATE_DIRS) throw Error('Issue reading files')

        const renderTemplates = await Promise.all(
            TEMPLATE_DIRS.map(async (template_dir) => {
                const indexFilePath = join(process.cwd(), 'templates', template_dir, 'index.html')
                try {
                    const html_template = await readFile(indexFilePath, 'utf-8')

                    /**
                     * Parsing the html template gives us a way to tell if the
                     * tags and loops are setup correctly.
                     */
                    const validHTML = parse(html_template, defaultConfig)

                    /**
                     * Check to make sure that the data object starts with "it."
                     */
                    validHTML
                        .filter((_) => _ === Object(_))
                        .forEach((item) => {
                            const treeObject = item as TemplateObject

                            /**
                             * Test text type
                             */
                            if (treeObject?.t === 'i') {
                                if (!treeObject?.c?.startsWith('it.')) {
                                    throw Error(
                                        `Invalid data object. Item (${treeObject?.c}) not starting with "it."`
                                    )
                                }
                            }

                            /**
                             * Test loop/for each types
                             */
                            if (treeObject?.t === 'h') {
                                if (!treeObject?.p?.startsWith('it.')) {
                                    throw Error(
                                        `Invalid loop object. Item (${treeObject?.p}) not starting with "it."`
                                    )
                                }
                            }
                        })

                    return [validHTML ? true : false]
                } catch (err) {
                    throw new Error(`Trouble parsing ${indexFilePath}...${err}`)
                }
            })
        ).then((data) => data.flat())

        const allTemplatesRendered = renderTemplates.every((item) => item === true)

        expect(allTemplatesRendered).toBe(true)
    })
})
