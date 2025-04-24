const jwt = require("jsonwebtoken");

const authMiddleware = (role = "user") => {
  return (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    try {
      // Verify token and handle expiration
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user's role matches the expected role
      if (verified.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = verified; // Attach verified user data to request object
      next(); // Proceed to next middleware/route handler
    } catch (err) {
      // Handling expired token separately to provide more specific error message
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired, please log in again" });
      }

      res.status(400).json({ message: "Invalid Token" });
    }
  };
};

module.exports = authMiddleware;
