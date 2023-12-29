const routes = (handler) => [
	{
		method: 'POST',
		path: '/songs',
		handler: (request, h) => handler.postSongHandler(request, h),
	},
	{
		method: 'GET',
		path: '/songs',
		handler: (request, h) => handler.getSongsHandler(request, h),
	},
	{
		method: 'GET',
		path: '/songs/{id}',
		handler: (request, h) => handler.getSongByHandlerId(request, h),
	},
	{
		method: 'PUT',
		path: '/songs/{id}',
		handler: (request, h) => handler.putSongByHandlerId(request, h),
	},
	{
		method: 'DELETE',
		path: '/songs/{id}',
		handler: (request, h) => handler.deleteSongByHandlerId(request, h),
	},
];

module.exports = routes;
