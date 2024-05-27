import http from 'http';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { app } from './App';
import { ENVIRONMENT_VAR } from './util/config';

dotenv.config({
  path: './config.env',
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// connect to DB
// removing the strictQuery to false as it will be deprecated
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_DB_URI || '').then(() => {
  console.log('🟢 Successfully Connected to DB');
}).catch((error) => {
  console.error('🔴 Error in connection to DB: ', error);
  process.exit(1);
});

// todo add all the middleware here. first check if it is the right way.

// if connection is successful then listen to port
mongoose.connection.once('open', () => {
  server.listen(ENVIRONMENT_VAR.PORT, () => {
    console.info(`Server running on : http://localhost:${ENVIRONMENT_VAR.PORT}`);
    // Note: This is only the socket connection made but we cannot keep only the socket connection
    // for the data transmission we require https server for api calls also
    // Socket connection helps us in making persistent connections and shouldn't be used for the https calls
    io.sockets.on('connection', (socket) => {
      console.log('client connect', socket);
      socket.on('echo', (data) => {
        console.log('data', data);
        io.sockets.emit('message', data);
      });
    });
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Server startup error: address already in use');
    } else {
      console.log(err);
    }
  });
});
