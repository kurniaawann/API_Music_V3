const Hapi = require("@hapi/hapi");
const ClientError = require("./exceptions/ClientError");
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');
//load ENV
require("dotenv").config();

//Album
const album = require("./api/album");
const AlbumService = require("./service/AlbumService");
const AlbumValidator = require("./validator/album");

//Song
const song = require("./api/song");
const SongService = require("./service/SongService");
const  SongValidator  = require("./validator/song");

//Users
const user = require("./api/user");
const UserService = require("./service/UserService");
const  UserValidator  = require("./validator/user");

//Authentication
const authentications = require("./api/authentication");
const AuthenticationService = require("./service/AuthenticationService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentication");

//playlist
const playlist = require("./api/playlist");
const PlaylistService = require("./service/PlaylistService");
const PlaylistValidator  = require("./validator/playlist");

//export
const _exports = require('./api/export');
const ProducerService = require('./service/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

//uploads
const uploads = require('./api/uploads');
const StorageService = require('./service/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

//album like
const albumLike = require('./api/albumLikeUser');
const AlbumLikeService = require('./service/AlbumLikeUserService');

//cache
const CacheService = require('./service/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UserService();
  const authenticationService = new AuthenticationService();
  const playlistService = new PlaylistService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const albumLikeService = new AlbumLikeService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  //register plugin external
  await  server.register([
    {
      plugin:Jwt
    },
    {
      plugin: Inert,
    },
  ]);
  //mendefinisikan strategy authentikasi jwt
  server.auth.strategy('playlist_jwt', 'jwt', {
    keys:process.env.ACCESS_TOKEN_KEY,
    verify:{
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec:process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts)=> ({
      isValid:true,
      credential:{
        id:artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    //Album
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    //song
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    //user
    {
      plugin:user,
      options:{
        service:usersService,
        validator:UserValidator
      }
    },
    //authentication
    {
      plugin:authentications,
      options:{
        authenticationService,
        usersService,
        tokenManager:TokenManager,
        validator:AuthenticationsValidator
      }
    },
    //Playlist
    {
      plugin:playlist,
      options:{
        service:playlistService,
        validator:PlaylistValidator
      }
    },
        
    //exxports
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistService:playlistService
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
        servicePostgre:albumService
      },
    },
    {
      plugin: albumLike,
      options: {
        service: albumLikeService,
      },
    },
  ]);
  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;


    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
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
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
