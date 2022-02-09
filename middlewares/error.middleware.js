const errorMiddleware = (err, _req, res, _next) => {
  if (err.status) {
    const { message, status } = err;

    return res.status(status).json({ message });
  }

  return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
};

module.exports = {
  errorMiddleware,
};
