const { readFile } = require('fs/promises')
const { error } = require('./src/constants')
const File = require('./src/file')
const { rejects, deepStrictEqual } = require('assert')
;
(async() => {
    {
        const filePath = './mocks/emptyFile-invalid.json'
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.jsonToCsv(filePath)
        await rejects(result, rejection)
    }
    {
        const filePath = './mocks/fourItems-invalid.json'
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.jsonToCsv(filePath)
        await rejects(result, rejection)
    }
    {
        const filePath = './mocks/invalid-properties.json'
        const rejection = new Error(error.FILE_FIELDS_ERROR_MESSAGE)
        const result = File.jsonToCsv(filePath)
        await rejects(result, rejection)
    }
    {
        Date.prototype.getFullYear = () => 2020
        const filePath = './mocks/threeItems-valid.json'
        const result = await File.jsonToCsv(filePath)
        const expected = (await readFile('./mocks/threeItems-valid.csv')).toString('utf8')

        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
    }
})()