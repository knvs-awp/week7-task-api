module.exports = (role) => (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Sign in required' });
  }

  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  next();
};
