const Prodi = require('../models/prodiModel');

exports.create = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.fakultas_id && !payload.fakultasId) {
      payload.fakultasId = payload.fakultas_id;
    }
    const prodi = await Prodi.create(payload);
    res.status(201).json(prodi);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  res.json(await Prodi.find());
};

exports.remove = async (req, res) => {
  try {
    const data = await Prodi.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
