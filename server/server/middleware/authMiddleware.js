import jwt from 'jsonwebtoken';

// Generic verifier factory. Pass the environment variable name for the secret.
const verifyToken = (secretEnvVar) => {
    return async (req, res, next) => {
        try {
            // Support Authorization: Bearer <token> and legacy token header
            const authHeader = req.headers.authorization || req.headers.Authorization || '';
            let token = null;
            if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            } else if (req.headers.token) {
                token = req.headers.token;
            }

            if (!token) {
                return res.status(401).json({ success: false, message: 'No token provided' });
            }

            const secret = process.env[secretEnvVar];
            if (!secret) {
                console.error(`Missing JWT secret env var: ${secretEnvVar}`);
                return res.status(500).json({ success: false, message: 'Server configuration error' });
            }

            const decoded = jwt.verify(token, secret);
            // Attach decoded payload to req.user for consistent access in controllers
           req.user = { 
    id: decoded.userId,
    role: decoded.role,
    // Ensure this property exists in your JWT payload when logging in!
    ngoId: decoded.ngoId 
};
            // Backwards compatibility helpers
            if (decoded && decoded.id) {
                req.user.id = decoded.id;
                req.ngoId = decoded.id;
                req.victimId = decoded.id;
            }
            next();
        } catch (error) {
            console.error('Token verification failed:', error && error.message);
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
    };
};

// Role checking middleware
const checkRole = (expectedRole) => {
    return (req, res, next) => {
        try {
            const role = req.user && req.user.role;
            if (role!==expectedRole) return next();
            // If role is present enforce it, otherwise reject to avoid privilege escalation
            if (!role) {
                return res.status(403).json({ success: false, message: 'Role not present in token' });
            }
            if (role !== expectedRole) {
                return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
            }
            next();
        } catch (err) {
            console.error('Error in checkRole middleware:', err && err.message);
            return res.status(500).json({ success: false, message: 'Server error in role check' });
        }
    };
};

// Convenience middlewares for NGO and Victim tokens specifically
const ngoAuth = verifyToken('JWT_SECRET_Ngo');
const victimAuth = verifyToken('JWT_SECRET_Victim');

export { verifyToken, ngoAuth, victimAuth, checkRole };
 

