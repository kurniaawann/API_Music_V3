const InvariantError = require('../../exceptions/InvariantError')
const {
    PostAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
} = require('./schema')



const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
        const validatoonResult = PostAuthenticationPayloadSchema.validate(payload)

        if (validatoonResult.error) {
        throw new InvariantError(validatoonResult.error.message)    
        }
    },
    validatePutAuthenticationPayload: (payload) => {
        const validatoonResult = PutAuthenticationPayloadSchema.validate(payload)

        if (validatoonResult.error) {
        throw new InvariantError(validatoonResult.error.message)    
        }
    },
    validateDeleteAuthenticationPayload: (payload) => {
        const validatoonResult = DeleteAuthenticationPayloadSchema.validate(payload)

        if (validatoonResult.error) {
        throw new InvariantError(validatoonResult.error.message)    
        }
    }
}

module.exports = AuthenticationsValidator