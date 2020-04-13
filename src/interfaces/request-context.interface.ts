import { Request } from 'express';

export interface IRequestContext extends Request {
  isAnonymous?: boolean;
  userId?: number;
}
