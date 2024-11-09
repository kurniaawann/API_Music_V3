const Joi = require('joi')

const PostPlaylistPayloadSchema = Joi.object({
    name: Joi.string().required()
});
const PostPlaylistAndSongPayloadSchema = Joi.object({
    songsId: Joi.string().required()
});


module.exports =  {PostPlaylistPayloadSchema, PostPlaylistAndSongPayloadSchema }