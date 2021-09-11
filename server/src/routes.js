const express = require("express");
const ohmService = require("./service/ohm");

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = function () {
  const router = express.Router();

  router.get(
    "/ohms/:trackingId",
    wrapAsync(async (req, res) => {
      const { trackingId } = req.params;
      const ohm = await ohmService.getOhm(trackingId);

      return res.send(ohm);
    })
  );

  router.post(
    "/ohms",
    wrapAsync(async (req, res) => {
      const ohm = await ohmService.createOhm(req.body);

      return res.send(ohm);
    })
  );

  router.post(
    "/ohms/:trackingId",
    wrapAsync(async (req, res) => {
      const { trackingId } = req.params;
      const ohm = await ohmService.updateOhm(trackingId, req.body);

      return res.send(ohm);
    })
  );

  router.post(
    "/ohms/:trackingId/copy",
    wrapAsync(async (req, res) => {
      const { trackingId } = req.params;
      const ohm = await ohmService.copyOhm(trackingId);

      return res.send(ohm);
    })
  );

  return router;
};
