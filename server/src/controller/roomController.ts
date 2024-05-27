import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { RoomSchema } from '../model/roomModel';
import { apiFailure } from '../util/apiService';

export const createRoom = async (req:Request, res:Response) => {
  try {
    // create the room with unique ID in backend
    const roomId = uuidv4();
    console.log(roomId);
    const newRoom = await RoomSchema.create({
      _id: roomId,
      // roomAdmin: req.body.userId,
    });
    // send the ID to the user and redirect the user to URL in frontend
    await res.status(200).json({
      status: 'success',
      data: {
        roomDetails: newRoom,
      },
    });
  } catch (error) {
    console.log('Error in Room Creation => ', error);
  }
};

export const enterRoom = async (res: Response, req: Request) => {
  try {
    // [optional ] check userName already present in the list of invite  ->  add this in the frontend send the entire inviteList to frontend.
    // if userName already present then no permission required
    // const user = await UserSchema.findById(req.body.params).exec();
    // else add the userName with permission from admin.
    // check the room ID and send the admin of the room with notification to add the user
    // as the user addition to the room is successful then add the username in list.
  } catch (e) {
    apiFailure(res, JSON.stringify(e));
  }
};

export const deleteRoom = async () => {
  // if the socket connections shows no one is there in room then delete the room
  // [future] Save the message and notes of the room
};
