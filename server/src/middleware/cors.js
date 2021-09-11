module.exports = (allowedOrigins = []) => {
  return (req, res, next) => {
    const { origin } = req.headers;

    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    }
    next();
  };
};
