const routes = (handler) => [
  {
    method: "songs",
    path: "/albums",
    handler: handler.postAlbumHandler,
  },
];

module.exports = routes;
