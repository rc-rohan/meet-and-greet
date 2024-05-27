// todo change the name as per the proper usage of the file.
import express, { Router } from 'express';
import {
  createRoom, enterRoom, deleteRoom,
} from '../controller/roomController';

const router: Router = express.Router();

// todo handle the check if there is any exising room with the
router.route('/createRoom').get(createRoom);

// handle the entery and deleteion of the room
router
  .route('/:roomID')
  .get(enterRoom)
  .delete(deleteRoom);

export default router;
