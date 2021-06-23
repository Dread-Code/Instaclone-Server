const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const awsUploadImage = require("../utils/aws-upload-image");

function createToken(user, SECRET_KEY, expiresIn) {
  const { id, name, email, username } = user;
  const payLoad = {
    id,
    name,
    email,
    username,
  };
  return jwt.sign(payLoad, SECRET_KEY, { expiresIn });
}

async function register(input) {
  const newUser = input;
  newUser.email = input.email.toLowerCase();
  newUser.username = input.username.toLowerCase();

  const { email, username, password } = newUser;

  // Revisamos si el  email esta en uso
  const foundEmail = await User.findOne({ email });
  if (foundEmail) throw new Error("Email already exists");

  // Revisamos si el username esta en uso
  const foundUsername = await User.findOne({ username });
  if (foundUsername) throw new Error("Username already exists");

  //Encriptar
  const salt = await bcryptjs.genSaltSync(10);
  newUser.password = await bcryptjs.hash(password, salt);
  try {
    const user = new User(newUser);
    user.save();
    return user;
  } catch (error) {}
}

async function login(input) {
  const { email, password } = input;

  const userFound = await User.findOne({ email: email.toLowerCase() });
  if (!userFound) throw new Error("Error en el email o contraseña");

  const passwordSuccess = await bcryptjs.compare(password, userFound.password);
  if (!passwordSuccess) throw new Error("Error en el password o contraseña");

  return {
    token: createToken(userFound, process.env.SECRET_KEY, "24h"),
  };
}

async function getUser(id, username) {
  let user = null;
  if (id) user = await User.findById(id);
  if (username) user = await User.findOne({ username });
  if (!user) throw new Error("El usuario no existe");
  return user;
}

async function updateAvatar(file, { user }) {
  const { id } = user;
  const { createReadStream, mimetype } = await file;
  const extension = mimetype.split("/")[1];
  const imageName = `avatar/${id}.${extension}`;
  const fileData = createReadStream();
  try {
    const { Location } = await awsUploadImage(fileData, imageName);
    await User.findByIdAndUpdate(id, {
      avatar: Location,
    });
    return {
      status: true,
      urlAvatar: Location,
    };
  } catch (error) {
    return {
      status: false,
      urlAvatar: null,
    };
  }
}

async function deleteAvatar(ctx) {
  const { id } = ctx;
  try {
    await User.findOneAndUpdate(id, { avatar: "" });
    return true;
  } catch (error) {
    return false;
  }
}

async function updateUser(input, ctx) {
  const { id } = ctx.user;
  const { currentPassword, newPassword } = input;
  try {
    if (currentPassword && newPassword) {
      //Cambiar contraseña
      const userFound = await User.findById(id);
      const passwordSuccess = await bcryptjs.compare(
        currentPassword,
        userFound.password
      );
      if (!passwordSuccess) throw new Error("Contraseña incorrecta");
      const salt = await bcryptjs.genSaltSync(10);
      const newPasswordCrypt = await bcryptjs.hash(newPassword, salt);
      await User.findByIdAndUpdate(id, { password: newPasswordCrypt });
    } else {
      await User.findOneAndUpdate(id, input);
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function search(search) {
  const users = await User.find({
    name: { $regex: search, $options: "i" },
  });
  return users;
}

module.exports = {
  register,
  login,
  getUser,
  updateAvatar,
  deleteAvatar,
  updateUser,
  search,
};
