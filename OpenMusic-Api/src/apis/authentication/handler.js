class AuthenticationsHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);
    const userId = await this._userService.verifyUserCredential(request.payload);
    const accessToken = this._tokenManager.generateAccessToken({ userId });
    const refreshToken = this._tokenManager.generateRefreshToken({ userId });

    await this._authenticationService.addRefreshToken(refreshToken);

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      })
      .code(201);
  }

  async putAuthenticationHandler(request, h) {
    const { refreshToken } = request.payload;
    this._validator.validatePutAuthenticationPayload({ refreshToken });
    await this._authenticationService.vefifyRefreshToken(refreshToken);
    const payload = this._tokenManager.verifyRefreshToken({ refreshToken });
    const accessToken = this._tokenManager.generateAccessToken(payload);

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
        },
      })
      .code(200);
  }

  async deleteAuthenticationHandler(request, h) {
    const { refreshToken } = request.payload;
    this._validator.validateDeleteAuthenticationPayload({ refreshToken });
    await this._authenticationService.vefifyRefreshToken(refreshToken);
    await this._authenticationService.deleteRefreshToken(refreshToken);

    return h
      .response({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      })
      .code(200);
  }
}

module.exports = AuthenticationsHandler;
