const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauces({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce créee !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  { 
    ...JSON.parse(req.body.sauce), // Si on a une image et qu'on veut la modifier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }; // Si on n'a pas de modification concernant l'image
    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
     const filename = sauce.imageUrl.split('/images/')[1];
     fs.unlink(`images/${filename}`, () => {
      Sauces.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
   .catch(error => res.status(500).json({ error }));
};

