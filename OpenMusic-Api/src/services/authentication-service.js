const { Pool } = require('pg');
const InvariantError = require('../errors/invariant-error');

class AuthenticationService {
	constructor() {
		this._pool = new Pool();
	}

	async addRefreshToken(token) {
		const query = {
			text: 'INSERT INTO authentications VALUES($1)',
			values: [token],
		};

		await this._pool.query(query);
	}

	async vefifyRefreshToken(refreshToken) {
		const query = {
			text: 'SELECT token FROM authentications WHERE token = $1',
			values: [refreshToken],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError('Refresh token tidak valid');
		}
	}

	async deleteRefreshToken(refreshToken) {
		const query = {
			text: 'DELETE FROM authentications WHERE token = $1',
			values: [refreshToken],
		};

		await this._pool.query(query);
	}
}

module.exports = AuthenticationService;
