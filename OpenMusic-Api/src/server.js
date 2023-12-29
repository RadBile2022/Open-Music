require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const path = require('path');
const ClientError = require('./errors/client-error');

const AlbumsService = require('./services/album-service');
const AlbumPlugin = require('./apis/album');
const AlbumValidator = require('./validators/album');

const SongService = require('./services/song-service');
const SongPlugin = require('./apis/song');
const SongValidator = require('./validators/song');

const UserService = require('./services/user-service');
const UserPlugin = require('./apis/user');
const UserValidator = require('./validators/user');

const AuthenticationService = require('./services/authentication-service');
const AuthenticationPlugin = require('./apis/authentication');
const AuthenticationValidator = require('./validators/authentication');
const TokenManager = require('./utils/token-manager');

const PlaylistService = require('./services/playlist-service');
const PlaylistPlugin = require('./apis/playlist');
const PlaylistValidator = require('./validators/playlist');

const PlaylistSongService = require('./services/song-playlist-service');
const PlaylistSongs = require('./apis/song-playlist/index');
const PlaylistSongValidator = require('./validators/song-playlist');

const AlbumLikeService = require('./services/album-like-service');
const AlbumLikePlugin = require('./apis/album-like/index');

const UploadService = require('./services/others/storage-service');
const UploadPlugin = require('./apis/upload/index');
const UploadValidator = require('./validators/upload/index');

const RabitService = require('./services/others/rabit-service');
const ExportPlugin = require('./apis/export/index');
const ExportValidator = require('./validators/export/index');

const CacheService = require('./services/others/cache-service');

const init = async () => {
  const albumService = new AlbumsService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService();
  const uploadService = new UploadService(path.resolve(__dirname, 'apis/upload/file/covers'));
  const cacheService = new CacheService();
  const likeAlbumsService = new AlbumLikeService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.userId,
      },
    }),
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      console.log(response.message);
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.register([
    {
      plugin: AlbumPlugin,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: SongPlugin,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: UserPlugin,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: AuthenticationPlugin,
      options: {
        authenticationsService: authenticationService,
        usersService: userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
    {
      plugin: PlaylistPlugin,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: PlaylistSongs,
      options: {
        playlistSongService,
        playlistService,
        songService,
        validator: PlaylistSongValidator,
      },
    },
    {
      plugin: ExportPlugin,
      options: {
        RabitService,
        playlistService,
        validator: ExportValidator,
      },
    },
    {
      plugin: UploadPlugin,
      options: {
        uploadsService: uploadService,
        albumsService: albumService,
        validator: UploadValidator,
      },
    },
    {
      plugin: AlbumLikePlugin,
      options: {
        albumLikeService: likeAlbumsService,
        albumService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
