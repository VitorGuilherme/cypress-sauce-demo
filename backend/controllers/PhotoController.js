const { json } = require("express");
const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
  const { title } = req.body;

  const image = req.file.fileName;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // Crete a photo
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  // If photo was created successfully, return data
  if (!newPhoto) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor tente novamente mais tarde"],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

//REMOVE A PHOTO FROM DB
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    //Check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde"],
      });
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso." });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
  }
};

// Get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

// Get photos by user id
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

//Get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(id);

  //Check if photo exists
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada"] });
  }

  res.status(200).json(photo);
};

// Update photo
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  //tive que lançar o gpt aqui kkkkk,não tava dando o put sem um body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      errors: ["Envie ao menos um campo para atualizar."],
    });
  }

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  // Check if photo exists
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada"] });
  }

  // Check if photo belongs to user
  if (!photo.userId.equals(reqUser._id)) {
    return res.status(422).json({
      errors: ["Ocorreu um erro, por favor tente novamente mais tarde"],
    });
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso" });
};

// Like functionality
const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  //check if photo exists
  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada"] });
  }

  // Check if user already liked the photo
  if (photo.likes.includes(reqUser._id)) {
    return res.status(422).json({ errors: ["Você já curtiu a foto."] });
  }

  // Put user id in likes array
  photo.likes.push(reqUser._id);

  photo.save();

  res
    .status(200)
    .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida." });
};

// Comment functionality
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada"] });
    }

    const userComment = {
      comment,
      userName: user.name,
      userImage: user.image,
      userId: user._id,
    };

    photo.comments.push(userComment);
    await photo.save();

    return res.status(200).json({
      comment: userComment,
      message: "Comentário foi adicionado",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Erro ao adicionar comentário"] });
  }
};

//Search photo
const searchPhoto = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};
module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhoto,
};
