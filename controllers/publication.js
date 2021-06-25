const Publication = require("../models/publication");
const Follow = require("../models/follow");
const User = require("../models/user");
const awsUploadImage = require("../utils/aws-upload-image");
const { v4: uuidv4 } = require("uuid");
const { NEW_PUBLICATION } = require("../gql/tags");

async function publish(file, { user }, pubSub) {
  const { id, username } = user;
  const { createReadStream, mimetype } = await file;
  const extension = mimetype.split("/")[1];
  const fileName = `publication/${uuidv4()}.${extension}`;
  const fileData = createReadStream();

  try {
    const { Location } = await awsUploadImage(fileData, fileName);
    const publication = new Publication({
      idUser: id,
      file: Location,
      typeFile: mimetype.split("/")[0],
      createdAt: Date.now(),
    });
    publication.save();

    let publications = await getPublications(username);
    pubSub.publish(NEW_PUBLICATION, { newPublication: publications });
    return {
      status: true,
      urlFile: Location,
    };
  } catch (error) {
    return {
      status: null,
      urlFile: "",
    };
  }
}

async function getPublications(username) {
  const { _id } = await User.findOne({ username });
  if (!_id) throw new Error("Usuario no encontrado.");

  const publicationList = await Publication.find({ idUser: _id }).sort({
    createdAt: -1,
  });
  return { publications: publicationList, username };
}

async function getPublicationsFollowed({ user }) {
  const followeds = await Follow.find({ idUser: user.id }).populate("follow");

  const followedList = [];

  for await (const data of followeds) {
    followedList.push(data.follow);
  }

  const publicationList = [];

  for await (const data of followedList) {
    const publications = await Publication.find()
      .where({
        idUser: data._id,
      })
      .sort({ createdAt: -1 })
      .populate("idUser");
    publicationList.push(...publications);
  }

  const result = publicationList.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return result;
}

module.exports = {
  publish,
  getPublications,
  getPublicationsFollowed,
};
