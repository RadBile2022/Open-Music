class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._service.addAlbum(request.payload);

    return h
      .response({
        status: 'success',
        data: {
          albumId,
        },
      })
      .code(201);
  }

  async getAlbumByHandlerId(request, h) {
    const album = await this._service.getAlbumById(request.params.id);

    return h
      .response({
        status: 'success',
        data: {
          album,
        },
      })
      .code(200);
  }

  async putAlbumByHandlerId(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    await this._service.editAlbumById(request.params.id, request.payload);

    return h
      .response({
        status: 'success',
        message: 'Album berhasil diperbarui',
      })
      .code(200);
  }

  async deleteAlbumByHandlerId(request, h) {
    await this._service.deleteAlbumById(request.params.id);

    return h
      .response({
        status: 'success',
        message: 'Album berhasil dihapus',
      })
      .code(200);
  }
}

module.exports = AlbumHandler;
