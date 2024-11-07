const Hapi = require("@hapi/hapi");
const ClientError = require("./exceptions/ClientError");

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
// const UserValidator = ('./validator/user')
const  UserValidator  = require("./validator/user");

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const usersService = new UserService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },

    {
      plugin:user,
      options:{
        service:usersService,
        validator:UserValidator
      }
    },
  ]);
  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    console.log(response.statusCode);

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
