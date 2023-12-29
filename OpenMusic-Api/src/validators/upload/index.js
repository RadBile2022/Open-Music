const InvariantError = require('../../errors/invariant-error');
const CoverImageHeaderSchema = require('./schema');

const UploadValidator = {
	validateCoverImageHeaders: (headers) => {
		const validationResult = CoverImageHeaderSchema.validate(headers);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = UploadValidator;
