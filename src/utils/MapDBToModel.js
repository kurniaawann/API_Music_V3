const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_Id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_Id,
});
module.exports = mapDBToModel;
