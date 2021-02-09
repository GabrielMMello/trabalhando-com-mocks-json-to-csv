const { readFile } = require('fs/promises')
const User = require('./user')
const { error } = require('./constants')

const DEFAULT_OPTION = {
    maxEntries: 3,
    fields: [ "id","name","profession","age" ]
}
class File {
    static async jsonToCsv(filePath) {
        const content = await File.getFileContent(filePath)
        const validation = File.isValid(content)
        if(!validation.valid) throw new Error(validation.error)

        const users = File.parseJSONtoCSV(content)
        return users
    }

    static async getFileContent(filePath) {
        return (await readFile(filePath)).toString('utf8')
    }
    static isValid(jsonString, options = DEFAULT_OPTION) {
        const users = JSON.parse(jsonString)

        const isContentLengthAccepted = (
            users.length > 0 &&
            users.length <= options.maxEntries
        )
        if(!isContentLengthAccepted) {
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        const usersProperties = users.map(user => Object.keys(user))
        // Se encontrar pelo menos uma propriedade inválida o conteúdo do arquivo será rejeitado
        const areContentPropertiesAccepted = !usersProperties.find(userProperties => {
            if(userProperties.length == 0 || userProperties.length > options.fields.length) return true

            for(const index in userProperties) {
                if(options.fields.findIndex(field => field === userProperties[index]) < 0) return true
            }

            return false
        }, true)
        if(!areContentPropertiesAccepted) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid: true }
    }
    static parseJSONtoCSV(jsonString) {
        const users = JSON.parse(jsonString)

        const headerFields = Object.keys(users[0])
        const header = (headerFields).join(',')

        const linesWithoutHeader = users.map(user => {
            const values = []
            for(const index in headerFields) {
                values.push(user[headerFields[index]])
            }
            return values.join(',')
        })

        const lines = ([header, ...linesWithoutHeader]).join('\r\n')

        return lines
    }
}

module.exports = File