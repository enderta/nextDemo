import jwt from 'jsonwebtoken';

const authMiddleware = (handler) => (req, res) => {
    // Get token from request header
    const token = req.header('Authorization');

    // If no token is provided, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify token and extract user role
        const { role } = jwt.verify(token, process.env.JWT_SECRET);

        // If user is not authorized, return 403 Forbidden
        if (role !== 'admin' && role !== 'user') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // If user is authorized, call the handler function
        return handler(req, res);
    } catch (error) {
        // If token is invalid or expired, return 401 Unauthorized
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authMiddleware;
