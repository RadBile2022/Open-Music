const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query = {
      text: 'SELECT playlists.name, playlist_songs.playlist_id, playlist_songs.song_id, songs.title, songs.performer FROM playlists LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id LEFT JOIN users ON playlists.owner = users.id LEFT JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const { name } = result.rows[0];

    const songs = result.rows.map((value) => ({
      id: value.song_id,
      title: value.title,
      performer: value.performer,
    }));

    return {
      playlist: { id: playlistId, name, songs },
    };
  }
}

module.exports = PlaylistService;
