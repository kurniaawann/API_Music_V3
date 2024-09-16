const Hapi = require("@hapi/hapi");
const album = require("./api/album");
const AlbumService = require("./service/AlbumService");
const AlbumValidator = require("./validator/album");
const ClientError = require("./exceptions/ClientError");
const { SongValidator } = require("./validator/song");
require("dotenv").config();

const init = async () => {
  const albumService = new AlbumService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  await server.register({
    plugin: album,
    options: {
      service: albumService,
      validator: {
        albumValidator: AlbumValidator,
        songValidator: SongValidator,
      },
    },
  });
  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);

      return newResponse;
    }

    return h.continue;
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
