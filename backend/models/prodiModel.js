const mongoose = require('mongoose');

const prodiSchema = new mongoose.Schema({
  kode: { type: String, required: [true, 'kode wajib diisi'], unique: true, trim: true, uppercase: true },
  nama: { type: String, required: [true, 'nama wajib diisi'], trim: true },
  fakultasId: { type: Number },
  fakultas_id: { type: Number },
});

module.exports = mongoose.model('Prodi', prodiSchema);
