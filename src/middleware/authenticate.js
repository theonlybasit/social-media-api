const jwt = require("jsonwebtoken");
const blacklist = require("../config/tokenBlacklist");

// AUTHENTICATE MIDDLEWARE
async function authenticate(req, res, next) {
  // Read the authorization header
  const authHeader = req.headers["authorization"];

  // Ensure the header exists and follows the "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  // Split off the token - "Bearer eyJ..." -> "eyJ..."
  const token = authHeader.split(" ")[1];

  // Reject the token  if it has been blacklisted (i.e. the user has logged out)
  // We return the same 401 as a bad token - revealing nothing extra to the caller

  if (blacklist.has(token)) {
    return res.status(401).json({
      message: "Access denied. Please log in again",
    });
  }

  try {
    // Cryptographically verify the token using the same secret that signed it
    // jwt.verify() throws an error if the token is Expired, tampered with , or malformed
    console.log(req.user);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the verified identity to the request object
    // From here, every downstream controller can read req.user.userId
    // and trust it as the authenticated user - no re-verification needed
    req.user = decoded;
    console.log(req.user);
    // Pass control to the next middleware or controller in the chain
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Access denied. Invalid or expired token",
    });
  }
}

module.exports = authenticate;
