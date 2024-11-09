const ClientError = require('../../exceptions/ClientError');
const PalaylistPaayloadSchema = require('./schema')

const PlaylistValidator = {
    validatePlaylistPayload: (payload)=> {
        const validationResult = PalaylistPaayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new ClientError(validationResult.error.message)
        }
    }
}

module.exports = PlaylistValidator