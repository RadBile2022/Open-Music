const AuthenticationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
	name: 'authentications',
	version: '1.0.0',
	register: async (
		server,
		{
			authenticationsService,
			usersService,
			tokenManager,
			validator,
		},
	) => {
		const albumHandler = new AuthenticationHandler(
			authenticationsService,
			usersService,
			tokenManager,
			validator,
		);
		server.route(routes(albumHandler));
	},
};
