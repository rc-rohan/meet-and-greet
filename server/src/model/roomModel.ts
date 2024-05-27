import {
  Schema, model, ObjectId,
} from 'mongoose';
import uuid from 'uuid';

// interface representing the room schema
interface Room {
  _id: string, // unique ID of the ROOM
  roomAdmin: ObjectId, // can use the userName or the ID of the user
  schduledTime?: Date
  invitee?: [string], // can be of type User also as user ata will be stored in this.
}

const schema = new Schema<Room>({
  // _id: Schema.Types.ObjectId,
  _id: {
    type: String,
    default: () => uuid.v4(), // todo make the ID small of the max 8 chars
  },
  roomAdmin: {
    type: Schema.Types.ObjectId,
    required: false, // todo make it as required later onn
  },
  invitee: [String], // list of people in the meeting
  // add the time of meeting
  // add whether it is repitative event
  // if repetative the daily timing
  // {
  //   timestamps: true,
  // },
});

const RoomSchema = model<Room>('Room', schema);
export { RoomSchema };
