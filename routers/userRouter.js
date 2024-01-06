const express = require('express');


const userController = require('../controllers/userController');
const userAuthenticateToken = require('../middleware/userAuthenticateToken');

const router = express.Router();

router.post('/user/create' ,userController.createUser);
router.get('/user/get/admin' , userController.getAdminUsers);
router.get('/user/get/basic' , userController.getBasicUsers);
router.get('/user/get' ,userAuthenticateToken, userController.getUsersByEmailId);
router.post('/user/update/phoneNumber',userAuthenticateToken, userController.updateAdminUsersPhoneNumber);
router.post('/user/update/education' , userAuthenticateToken,userController.updateAdminUsersEducation);
router.post('/user/update/hobby' ,userAuthenticateToken, userController.updateUserHobby);
router.delete('/user/delete' , userAuthenticateToken,userController.deleteAdminUserByEmailId);
router.post('/user/get/token' , userController.createJwtTokenByQueryEmail);


module.exports = router;
