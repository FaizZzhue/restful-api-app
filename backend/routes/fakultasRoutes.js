const express = require('express');
const router = express.Router();
const fakultasController = require('../controllers/fakultasController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', fakultasController.getAll);
router.get('/:id', fakultasController.getById);
router.post('/', cekApiKey, fakultasController.create);
router.delete('/:id', cekApiKey, fakultasController.remove);

module.exports = router;
