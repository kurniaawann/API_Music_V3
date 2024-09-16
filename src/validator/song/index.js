const { BasicSongPayloadSchema, FullSongPayloadSchema } = require("./scheme");

const SongValidator = {
  basicValidateSongsPayload: (payload) => {
    const validationResult = BasicSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  fullValidateSongsPayload: (payload) => {
    const validationResult = FullSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = {
  SongValidator,
};
