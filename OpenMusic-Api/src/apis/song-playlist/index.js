const PlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'playlistsongs',
	version: '1.0.0',
	register: async (server, {
		playlistSongService,
		playlistService,
		songService,
		validator,
	}) => {
		const playlistSongHandler = new PlaylistSongHandler(
			playlistSongService,
			playlistService,
			songService,
			validator,
		);
		server.route(routes(playlistSongHandler));
	},
};
