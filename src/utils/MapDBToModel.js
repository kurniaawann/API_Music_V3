// mapDBToModelAlbums.js
const mapDBToModel = ({ cover_url, album_id , ...args }) => ({
  ...args,
  coverUrl: cover_url, 
  albumId: album_id
});

module.exports = mapDBToModel;