class SongHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;
	}

	async postSongHandler(request, h) {
		this._validator.validateSongPayload(request.payload);
		const songId = await this._service.addSong(request.payload);

		return h.response(
			{
				status: 'success',
				data: {
					songId,
				},
			},
		).code(201);
	}

	async getSongsHandler(request, h) {
		const songs = await this._service.getSongs(request.query);
		return {
			status: 'success',
			data: {
				songs,
			},
		};
	}

	async getSongByHandlerId(request, h) {
		const song = await this._service.getSongById(request.params.id);

		return h.response(
			{
				status: 'success',
				data: {
					song,
				},
			},
		).code(200);
	}

	async putSongByHandlerId(request, h) {
		this._validator.validateSongPayload(request.payload);
		await this._service.editSongById(request.params.id, request.payload);

		return h.response(
			{
				status: 'success',
				message: 'Berhasil memperbarui lagu',
			},
		).code(200);
	}

	async deleteSongByHandlerId(request, h) {
		await this._service.deleteSongById(request.params.id);

		return h.response(
			{
				status: 'success',
				message: 'Lagu berhasil dihapus',
			},
		).code(200);
	}
}

module.exports = SongHandler;
