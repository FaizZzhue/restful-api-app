let fakultas = [
  { id: 1, nama: 'Fakultas Ilmu Komputer dan Rekayasa', singkatan: 'FIKR' },
  { id: 2, nama: 'Fakultas Ekonomi dan Bisnis', singkatan: 'FEB' },
];
let nextId = 3;

function getAll() {
  return fakultas;
}

function getById(id) {
  return fakultas.find((f) => f.id === id);
}

function create(data) {
  const baru = {
    id: nextId++,
    nama: data.nama,
    singkatan: data.singkatan || '',
  };
  fakultas.push(baru);
  return baru;
}

function remove(id) {
  const index = fakultas.findIndex((f) => f.id === id);
  if (index === -1) return false;
  fakultas.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, remove };
