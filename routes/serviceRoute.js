const router = require('express').Router();
const protected = require('../middlewares/authMiddleware');
const {
	getServices,
	createService,
	updateService,
	deleteService,
	myServices
} = require('../controllers/servicesControllers');

router.route('/').get(protected, getServices);
router.route('/create').post(protected, createService);
router.route('/update/:id').put(protected, updateService);
router.route('/delete/:id').delete(protected, deleteService);
router.route('/:id').get(protected, myServices);

module.exports = router;
