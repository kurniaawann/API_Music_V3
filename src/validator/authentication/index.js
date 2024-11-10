const ClientError = require('../../exceptions/ClientError')
const {
    PostAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
} = require('./schema')



const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
        const validationResult = PostAuthenticationPayloadSchema.validate(payload)

        if (validationResult.error) {
        throw new ClientError(validationResult.error.message)    
        }
    },
    validatePutAuthenticationPayload: (payload) => {
        const validationResult = PutAuthenticationPayloadSchema.validate(payload)

        if (validationResult.error) {
        throw new ClientError(validationResult.error.message)    
        }
    },
    validateDeleteAuthenticationPayload: (payload) => {
        const validationResult = DeleteAuthenticationPayloadSchema.validate(payload)

        if (validationResult.error) {
            console.log("error");
        throw new ClientError(validationResult.error.message)    
        }
    }
}

module.exports = AuthenticationsValidator