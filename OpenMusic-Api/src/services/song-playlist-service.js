const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../errors/invariant-error');
const NotFoundError = require('../errors/not-found-error');

class SongPlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO  playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Tidak dapat menambahkan lagu pada playlist');
    }
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: 'SELECT playlists.name, playlist_songs.playlist_id, playlist_songs.song_id, users.username, songs.title, songs.performer FROM playlists LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id LEFT JOIN users ON playlists.owner = users.id LEFT JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ada. Id tidak ditemukan');
    }

    console.log(result.rows[0]);

    const { username, name, playlist_id: id } = result.rows[0];

    const songs = result.rows.map((value) => ({
      id: value.song_id,
      title: value.title,
      performer: value.performer,
    }));

    return {
      id,
      name,
      username,
      songs,
    };
  }

  async deleteSongFromPlaylist(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu dari playlist. Id lagu tidak ditemukan');
    }
  }
}

module.exports = SongPlaylistService;
