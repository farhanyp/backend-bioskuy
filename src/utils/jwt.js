import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiration} from '../config.js';

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiration,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, jwtSecret);


export{
  createJWT,
  isTokenValid,
};