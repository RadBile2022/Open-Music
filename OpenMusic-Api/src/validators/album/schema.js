const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
	name: Joi.string().required(),
	year: Joi.number().integer().min(1000).max(10000)
		.required(),
});

module.exports = AlbumPayloadSchema;
