class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist(request.payload.name, credentialId);

    return h
      .response({
        status: 'success',
        data: {
          playlistId,
        },
      })
      .code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return h
      .response({
        status: 'success',
        data: {
          playlists,
        },
      })
      .code(200);
  }

  async deletePlaylistByHandlerId(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return h
      .response({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      })
      .code(200);
  }
}

module.exports = PlaylistHandler;
