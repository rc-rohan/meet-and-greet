import { Response } from 'express';

// todo make this function more functionable by sending the message and also the statusCode in fucntion Call.
export const apiFailure = (res: Response, errorMessage: string) => res.status(404).json({
  status: 'failed',
  message: `Failed to fetch the data: ${errorMessage}`,
});
