const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../errors/invariant-error');
const NotFoundError = require('../errors/not-found-error');

class AlbumLikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menambahkan like. Album id tidak ditemukan');
    }

    await this._cacheService.delete(`albumId:${albumId}`);
  }

  async getLikesById(albumId) {
    try {
      const result = await this._cacheService.get(`albumId:${albumId}`);
      const likes = JSON.parse(result);
      return { likes, cache: 'cache' };
    } catch (e) {
      const query = {
        text: 'SELECT album_id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = result.rows.length;

      await this._cacheService.set(`albumId:${albumId}`, result.rows.length.toString());

      return { likes };
    }
  }

  async deleteLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus like. Album id tidak ditemukan');
    }

    await this._cacheService.delete(`albumId:${albumId}`);
  }

  async verifyLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Tidak dapat menglike 2 kali dalam 1 album');
    }
  }
}

module.exports = AlbumLikeService;
