const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../errors/invariant-error');
const NotFoundError = require('../errors/not-found-error');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async addCover(coverUrl, id) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('Cover gagal ditambahkan. Id tidak valid');
    }
  }

  async getAlbumById(albumId) {
    const query = {
      text: 'SELECT songs.*, albums.name, albums.year, albums.cover_url FROM songs RIGHT JOIN albums ON songs.album_id = albums.id WHERE albums.id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const id = albumId;
    const { name, year, cover_url: coverUrl } = result.rows[0];

    const songs = result.rows
      .filter((value) => value.id !== null)
      .map((value) => ({
        id: value.id,
        title: value.title,
        performer: value.performer,
      }));

    return {
      id,
      name,
      year,
      songs,
      coverUrl,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyAlbumId(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album id tidak valid');
    }
  }
}

module.exports = AlbumService;
