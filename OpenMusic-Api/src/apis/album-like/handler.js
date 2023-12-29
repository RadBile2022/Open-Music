class AlbumLikeHandler {
  constructor(albumLikeService, albumService) {
    this._albumLikeService = albumLikeService;
    this._albumService = albumService;
  }

  async postLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumService.verifyAlbumId(albumId);
    await this._albumLikeService.verifyLike(albumId, userId);
    await this._albumLikeService.addLike(albumId, userId);

    return h
      .response({
        status: 'success',
        message: 'Like berhasil ditambahkan',
      })
      .code(201);
  }

  async getLikesAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;

    const result = await this._albumLikeService.getLikesById(albumId);

    const response = h
      .response({
        status: 'success',
        data: {
          likes: result.likes,
        },
      })
      .code(200);

    if (result.cache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteLikeAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumLikeService.deleteLike(albumId, userId);

    return h
      .response({
        status: 'success',
        message: 'Like berhasil dihapus',
      })
      .code(200);
  }
}

module.exports = AlbumLikeHandler;
