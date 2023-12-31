const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../errors/invariant-error');
const NotFoundError = require('../errors/not-found-error');
const AuthorizationError = require('../errors/authorization-error');

class PlaylistService {
	constructor() {
		this._pool = new Pool();
	}

	async addPlaylist(name, userId) {
		const id = `playlist-${nanoid(16)}`;
		const query = {
			text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
			values: [id, name, userId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError('Gagal menambahkan playlist');
		}

		return result.rows[0].id;
	}

	async getPlaylists(userId) {
		const query = {
			text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1',
			values: [userId],
		};

		const result = await this._pool.query(query);

		return result.rows;
	}

	async deletePlaylistById(id) {
		const query = {
			text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Gagal menghapus playlist. Id tidak ditemukan');
		}
	}

	async verifyPlaylistOwner(id, owner) {
		const query = {
			text: 'SELECT * FROM playlists WHERE id = $1',
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Playlist tidak ditemukan');
		}

		if (result.rows[0].owner !== owner) {
			throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
		}
	}
}

module.exports = PlaylistService;
