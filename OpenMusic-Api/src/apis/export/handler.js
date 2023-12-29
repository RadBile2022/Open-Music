class ExportHandler {
  constructor(rabitService, playlistService, validator) {
    this._rabitService = rabitService;
    this._playlistService = playlistService;
    this._validator = validator;
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const { playlistId: id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(id, credentialId);

    const message = {
      playlistId: request.params.playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this._rabitService.sendMessage('export:playlists', JSON.stringify(message));

    return h
      .response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      })
      .code(201);
  }
}

module.exports = ExportHandler;
