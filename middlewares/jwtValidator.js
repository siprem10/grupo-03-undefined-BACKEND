const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

  const token = req.header("auth-token");

  if(!token) {
    return res.status(401).json({ error: "Access denied!" })
  }
  
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.body.user = verified;
    next();

  } catch (error) {    
    return res.status(400).json({error: "Invalid token!"});
  }
}

module.exports = {
  verifyToken
};