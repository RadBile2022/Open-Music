const InvariantError = require('../../errors/invariant-error');
const ExportPlaylistsPayloadSchema = require('./schema');

const ExportValidator = {
  validateExportPlaylistsPayload: (payload) => {
    const validationResult = ExportPlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportValidator;
