const InvariantError = require('../../errors/invariant-error');
const SongPayloadSchema = require('./schema');

const SongValidator = {
	validateSongPayload: (payload) => {
		const validationResult = SongPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = SongValidator;
