const express = require('express');
const router = express.Router();
const c = require('../controllers/prodiController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', c.getAll);
router.post('/', cekApiKey, c.create);
router.delete('/:id', cekApiKey, c.remove);

module.exports = router;
