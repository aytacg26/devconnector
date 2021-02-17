import jwt from 'jsonwebtoken';
import { errorMessage } from '../messages/messages.js';

import config from 'config'; //we will need this for jwtSecretToken

//Because this is an middleware function, it will take three parameters, these are req (request), res (response) and next
export const authMiddleware = (req, res, next) => {
  //Get Token from header, x-auth-token is a key which we assign to header and it's value will be the token
  const token = req.header('x-auth-token');

  //Check if not token, if there is no token, we will response with 401 - not authorized
  if (!token) {
    // return res
    //   .status(401)
    //   .json({ errors: [{ msg: 'No token, authorization denied' }] });
    return errorMessage(res, 401, 'No token, authorization denied');
  }

  //Verify the token, if there is a token, we must verify it!!
  try {
    //this will decode the token, which we will have data of payload in it.
    const decoded = jwt.verify(token, config.get('jwtSecretToken'));

    //from decoded token, we will get user and send to the next middleware, if the token is not valid, the process will be end in catch block
    req.user = decoded.user;
    next();
  } catch (error) {
    // res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    errorMessage(res, 401, 'Token is not valid');
  }
};
