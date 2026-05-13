const windows = new Map();

function createRateLimiter({ windowMs = 60_000, max = 120 } = {}) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl || req.path}`;
    const now = Date.now();
    const record = windows.get(key);

    if (!record || record.expiresAt < now) {
      windows.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again shortly.',
      });
    }

    record.count += 1;
    return next();
  };
}

module.exports = createRateLimiter;
