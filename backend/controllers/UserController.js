const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register user and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["E-mail já cadastrado"] });
    return;
  }

  // Generate password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create User
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // If user was created successfully, return the token
  if (!newUser) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor tente novamente mais tarde"],
    });
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// User sign in
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  //Check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida."] });
    return;
  }

  // Return user with token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// Get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(reqUser._id).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    //Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o usuário direto pelo id (sem converter manualmente)
    const user = await User.findById(id).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ errors: ["Usuário não encontrado!"] });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ errors: ["Erro ao buscar usuários!"] });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Garante que existe um usuário autenticado (req.user vem do middleware)
  if (!req.user) {
    return res.status(401).json({ errors: ["Acesso negado!"] });
  }

  try {
    //  Opcional: você pode verificar se o usuário autenticado é o dono do id que está tentando deletar.
    if (req.user._id.toString() !== id) {
      return res.status(403).json({ errors: ["Ação não permitida!"] });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado!"] });
    }
    return res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ errors: ["Erro ao deletar usuário!"] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  getAllUsers,
  deleteUser,
};
