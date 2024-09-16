const { register } = require("../album");
const SongHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "Song V1",
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(routes(songHandler));
  },
};
