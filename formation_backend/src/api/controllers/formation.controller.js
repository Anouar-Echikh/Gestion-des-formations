const db = require("../../database/db.config");
const Formation = db.formation;
//create a new Formation
exports.create = (req, res) => {
  //récupération des données
  const { nomF, duree, prix, type,image, dateDebut, formateur, participants } =
    req.body;
  if (
    !nomF ||
    !duree ||
    !prix ||
    !type ||
    !image ||
    !dateDebut ||
    !formateur 
  ) {
    return res.status(400).send({
      message: "content can not be empty",
    });
  }

  const newFormation = new Formation({
    nomF,
    duree,
    prix,
    type,
    image,
    dateDebut,
    formateur,
    participants,
    created:new Date(),
  });
  newFormation
    .save(newFormation)
    .then((data) => {
      res.status(200).send({
        message: "successufully created formation",
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.findAll = (req, res) => {
  Formation.find({})
  .populate({ path: "participants",  model: "User" })
  .populate({ path: "formateur", select: "name ", model: "User" })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
};
//consultation par id
exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "content is required " });
  }
  Formation.findById(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
};
//suppression par id
exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "content is required : id is required" });
  }
  Formation.findByIdAndDelete(id).then((data) => {
    if (!data) {
      res.status(404).send({ message: "Formation not found " });
    }
    res.status(200).send({ message: "Formation was successfull deleted " });
  });
};

// patch News
exports.patch = async (req, res, next) => {
  let body = req.body;
  let id = req.params.id;
  body = { ...body, lastUpdate: new Date() };
  try {
    const updatedFormation = await Formation.updateOne({ _id: id }, body);
    res.send({
      success: true,
      updatedFormation,
    });
  } catch (e) {
    next(e);
  }
};
