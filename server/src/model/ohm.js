const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const adapter = new FileAsync("db.json");
const config = require("../../db.config.json");
const shortid = require("shortid");
const HttpError = require("../error/HttpError");

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})();

async function find(trackingId) {
  const _db = await db;
  const ohm = await _db.get("ohms").find({ trackingId }).value();

  if (!ohm) {
    throw new HttpError(`TrackingId ${trackingId} not found`, 404);
  }

  return ohm;
}

async function update(trackingId, data) {
  const _db = await db;

  await _db.get("ohms").find({ trackingId }).assign(data).write();

  return _db.get("ohms").find({ trackingId }).value();
}

async function add(ohmDetails) {
  const _db = await db;
  const trackingId = shortid.generate();
  const id = shortid.generate();

  await _db
    .get("ohms")
    .push({ ...ohmDetails, id, trackingId })
    .write();

  return _db.get("ohms").find({ trackingId }).value();
}

module.exports = {
  find,
  update,
  add,
};
