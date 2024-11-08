const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required().min(2022).max(2024),
});

module.exports =  AlbumPayloadSchema ;
