const router = require('express').Router();
const {
	getUsers,
	addUser,
	loginUser,
	updateUser,
	deleteUser,
	getUserbyId
} = require('../controllers/userControllers');
const protected = require('../middlewares/authMiddleware');

router.route('/').get(protected, getUsers);
router.route('/:id').get(protected, getUserbyId);
router.route('/update/:id').put(protected, updateUser);
router.route('/delete/:id').delete(protected, deleteUser);
router.route('/register').post(addUser);
router.route('/login').post(loginUser);

module.exports = router;
