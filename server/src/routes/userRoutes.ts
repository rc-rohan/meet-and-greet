import express, { Router } from 'express';
import {
  createUser, deleteUser, getUserByID, updateUserDetails,
} from '../controller/userController';

const router: Router = express.Router();

router.route('/createUser').post(createUser);

router
  .route('/:id')
  .get(getUserByID)
  .patch(updateUserDetails)
  .delete(deleteUser);

export default router;
