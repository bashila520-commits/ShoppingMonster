const jwt = require('jsonwebtoken');

// 验证 JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未授权: 缺少 token',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token 无效或已过期',
    });
  }
};

// 验证管理员权限
const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '禁止访问: 需要管理员权限',
    });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
