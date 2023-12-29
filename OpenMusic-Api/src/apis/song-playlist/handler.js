class PlaylistSongHandler {
	constructor(playlistSongsService, playlistService, songService, validator) {
		this._playlistSongsService = playlistSongsService;
		this._playlistService = playlistService;
		this._songService = songService;
		this._validator = validator;
	}

	async postSongToPlaylistHandler(request, h) {
		this._validator.validatePlaylistSongPayload(request.payload);

		const { songId } = request.payload;
		const { id } = request.params;
		const { id: credentialId } = request.auth.credentials;

		await this._playlistService.verifyPlaylistOwner(id, credentialId);
		await this._songService.verifySongId(songId);
		await this._playlistSongsService.addSongToPlaylist(id, songId);

		return h.response(
			{
				status: 'success',
				message: 'Berhasil menambahkan lagu ke playlist',
			},
		).code(201);
	}

	async getSongsInPlaylistHandler(request, h) {
		const { id } = request.params;
		const { id: credentialId } = request.auth.credentials;

		await this._playlistService.verifyPlaylistOwner(id, credentialId);
		const playlist = await this._playlistSongsService.getSongsInPlaylist(id);

		return h.response(
			{
				status: 'success',
				data: {
					playlist,
				},
			},
		).code(200);
	}

	async deleteSongFromPlaylistByHandlerId(request, h) {
		this._validator.validatePlaylistSongPayload(request.payload);

		const { id } = request.params;
		const { songId } = request.payload;
		const { id: credentialId } = request.auth.credentials;

		await this._playlistService.verifyPlaylistOwner(id, credentialId);
		await this._playlistSongsService.deleteSongFromPlaylist(songId);

		return h.response(
			{
				status: 'success',
				message: 'Lagu berhasil dihapus dari playlist',
			},
		).code(200);
	}
}

module.exports = PlaylistSongHandler;
