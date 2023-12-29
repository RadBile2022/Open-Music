const Joi = require('joi');

const CoverImageHeaderSchema = Joi.object({
	'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = CoverImageHeaderSchema;
