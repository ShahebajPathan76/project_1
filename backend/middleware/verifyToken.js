const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
   
//     console.log("Auth Header:", req.headers.authorization); // See if token is received
// if (!process.env.SECRET_KEY) {
//   console.log("❌ SECRET_KEY is missing from .env or dotenv is not loaded.");
// } else {
//   console.log("✅ SECRET_KEY Loaded:", process.env.SECRET_KEY);
// }


    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
