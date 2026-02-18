import express from "express";
import { register,logout,login, getProfile, getSuggestedUsers, followOrUnfollow,editProfile, getSearchedUser, getAllFollowing, deleteProfile } from "../Controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated,getProfile);
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePicture'),editProfile);
router.route('/suggested').get(isAuthenticated,getSuggestedUsers);
router.route('/users/search').get(isAuthenticated,getSearchedUser);
router.route('/followorunfollow/:id').get(isAuthenticated,followOrUnfollow);
router.route('/following').get(isAuthenticated,getAllFollowing);
router.route('/deleteProfile/:id').delete(isAuthenticated,deleteProfile);
export default router;