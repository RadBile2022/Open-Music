class UploadHandler {
  constructor(uploadService, albumService, validator) {
    this._uploadService = uploadService;
    this._albumService = albumService;
    this._validator = validator;
  }

  async postUploadCoverImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateCoverImageHeaders(cover.hapi.headers);

    const filename = await this._uploadService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/covers/${filename}`;

    await this._albumService.addCover(fileLocation, id);

    return h
      .response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      })
      .code(201);
  }
}

module.exports = UploadHandler;
