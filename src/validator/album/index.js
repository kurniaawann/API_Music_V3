const ClientError = require("../../exceptions/ClientError");

const  AlbumPayloadSchema  = require("./scheme");

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      console.log(validationResult.error.message);
      throw new ClientError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
