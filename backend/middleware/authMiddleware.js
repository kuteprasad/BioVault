import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  // console.log("Received Token:", req.headers.authorization);


  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    console.log("No token, authorization denied");
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // console.log("Token:", token);
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded:", decoded);
    req.user = decoded;
    // console.log("Decoded:", decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;