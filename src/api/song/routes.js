const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: handler.postAlbumHandler,
  },
];

module.exports = routes;
