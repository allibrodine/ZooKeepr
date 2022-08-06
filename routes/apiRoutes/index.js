const router = require('express').Router();
const anmialRoutes = require('../apiRoutes/animalRoutes');

router.use(anmialRoutes);

module.exports = router;