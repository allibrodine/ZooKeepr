const router = require('express').Router();
const anmialRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

router.use(anmialRoutes);
router.use(zookeeperRoutes);

module.exports = router;