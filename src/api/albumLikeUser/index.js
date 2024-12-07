const  AlbumLikeHandler  = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "Album like Music V1",
  version:'1.0.0',
  register: async (server, { service }) => {
    const albumHandler = new AlbumLikeHandler(service);
    server.route(routes(albumHandler));
  },
};
