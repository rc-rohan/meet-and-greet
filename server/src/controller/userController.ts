import { Request, Response } from 'express';
import { UserSchema } from '../model/userModel';
import { apiFailure } from '../util/apiService';

// create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserSchema.findOne(req.body.email);
    // userId already exists
    if (user !== null) {
      res.status(200).json({
        status: 'success',
        data: {
          error: 'User already exists',
        },
      });
      return;
    }
    // user not existing -> create new user
    const newUser = await UserSchema.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    apiFailure(res, JSON.stringify((e)));
  }
};

// get user by ID
export const getUserByID = async (req: Request, res: Response) => {
  try {
    const user = await UserSchema.findById(req.params.Id).exec();

    if (user) {
      res.status(200).json({
        status: 'success',
        // results: user.length,
        data: {
          user, // data for the user
        },
      });
    }
  } catch (e) {
    apiFailure(res, JSON.stringify((e)));
  }
};

// update the user details and add the updated user to the lsit..
export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const {
      firstName, lastName, email, password, confirmPassword, avatar,
    } = req.body;
    const user = await UserSchema.findById(req.body.params).exec();

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.avatar = avatar || user.avatar;
      if (password) { // todo check if it checks the confirm password properly and doesn't fails.
        user.confirmPassword = confirmPassword;
        user.password = password;
      }

      const updatedUser = await user.save();
      res.status(200).json({
        status: 'success',
        data: {
          updatedUser,
        },
      });
    }
  } catch (e) {
    apiFailure(res, JSON.stringify(e));
  }
};

// delete the user account from the list
export const deleteUser = async (res: Response, req: Request) => {
  try {
    const user = await UserSchema.findById(req.body.params).exec();
    const { deletedCount } = await UserSchema.deleteOne({
      _id: user?._id, // check this error
    });
    if (deletedCount === 1) {
      res.status(200).json({
        status: 'success',
        data: {
          deletedCount,
        },
      });
    } else {
      throw new Error('User not Found');
    }
  } catch (e) {
    apiFailure(res, JSON.stringify(e));
  }
};
