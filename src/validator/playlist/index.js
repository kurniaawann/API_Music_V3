const ClientError = require('../../exceptions/ClientError');
const {PostPlaylistPayloadSchema, PostPlaylistAndSongPayloadSchema} = require('./schema')

const PlaylistValidator = {
    validatePlaylistPayload: (payload)=> {
        const validationResult = PostPlaylistPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new ClientError(validationResult.error.message)
        }
    },
    validatePlaylistAndSongPayload: (payload)=> {
        const validationResult = PostPlaylistAndSongPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new ClientError(validationResult.error.message)
        }
    }


}

module.exports = PlaylistValidator