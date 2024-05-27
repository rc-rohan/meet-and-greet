import express, {
  Application, Request, Response,
} from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import roomRoutes from './routes/roomRoutes';
import { ENVIRONMENT_VAR } from './util/config';

const app : Application = express();

// note: order of the middleware declaration matters here.

app.use(cors({
  origin: '*',
}));

if (ENVIRONMENT_VAR.ENVIRONMENT === 'development') {
  app.use(morgan('dev'));
}
// convert all requests to json
app.use(express.json());
// todo send the user request to the user Route

// create socket connection

// routes to make new room request with unique ID.
app.use('/meet/', roomRoutes);

// route to create user
app.use('/user', userRoutes);

// todo removed later on don't need to handle this
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World from app');
});

export { app };
