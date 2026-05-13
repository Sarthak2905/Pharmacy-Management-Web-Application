const windows = new Map();
let cleanupStarted = false;

function startCleanup() {
  if (cleanupStarted) {
    return;
  }

  cleanupStarted = true;
  const timer = setInterval(() => {
    const now = Date.now();

    for (const [key, record] of windows.entries()) {
      if (record.expiresAt < now) {
        windows.delete(key);
      }
    }
  }, 60_000);

  timer.unref?.();
}

function createRateLimiter({ windowMs = 60_000, max = 120 } = {}) {
  startCleanup();

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
