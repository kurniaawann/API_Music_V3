const routes = (handler) => [
  {
    method: "POST",
    path: "/album",
    handler: handler.postAlbumHandler,
  },
];

module.exports = routes;
