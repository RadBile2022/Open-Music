exports.up = (pgm) => {
	// Foreign key playlists.owner with users.id
	pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

	// Foreign key playlist_songs.song_id with songs.id
	pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

	// Foreign key playlist_songs.playlist_id with playlists.id
	pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

	// Foreign key songs.albumid with albums.id
	pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
	// Foreign key playlists.owner with users.id
	pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');

	// Foreign key playlist_songs.song_id with songs.id
	pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id');

	// Foreign key playlist_songs.playlist_id with playlists.id
	pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id');

	// Foreign key songs.albumid with albums.id
	pgm.dropConstraint('songs', 'fk_songs.albumid_albums.id');
};
