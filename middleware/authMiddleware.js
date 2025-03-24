import jwt from "jsonwebtoken";

export default function authMiddleware(handler) {
  return async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).end("Unauthorized");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).end("Unauthorized");
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("Missing JWT_SECRET in environment variables.");
      }

      const decoded = jwt.verify(token, secret);
      req.user = decoded; // Attach decoded payload to req.user
      return handler(req, res);
    } catch (error) {
      console.error("JWT verification failed:", error);
      return res.status(401).end("Unauthorized");
    }
  };
}
