module.exports = () => (err, req, res, next) => {
  const { message = "Internal error", status = 500 } = err || {};

  res.status(status);
  res.json({ message });
};
