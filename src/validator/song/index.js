const ClientError = require("../../exceptions/ClientError");
const  SongPayloadSchema  = require("./scheme");

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = SongValidator
