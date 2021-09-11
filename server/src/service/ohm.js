const HttpError = require("../error/HttpError");
const { find, add, update } = require("../model/ohm");

const STATUS = {
  CREATED: "CREATED",
  PREPARING: "PREPARING",
  READY: "READY",
  IN_DELIVERY: "IN_DELIVERY",
  DELIVERED: "DELIVERED",
  REFUSED: "REFUSED",
};
const statusTransition = {
  [STATUS.CREATED]: [STATUS.PREPARING],
  [STATUS.PREPARING]: [STATUS.READY],
  [STATUS.READY]: [STATUS.IN_DELIVERY],
  [STATUS.IN_DELIVERY]: [STATUS.DELIVERED, STATUS.REFUSED],
};
const statusComments = [STATUS.DELIVERED, STATUS.REFUSED];

async function updateOhmStatus(ohm, status) {
  const allowedTransitions = statusTransition[ohm.status];

  if (!STATUS[status]) {
    throw new HttpError(`Status ${status} not supported!`, 400);
  }

  if (!allowedTransitions) {
    throw new HttpError(`Status ${status} cannot be updated!`, 400);
  }

  if (!allowedTransitions.includes(status)) {
    throw new HttpError(
      `Status transition not supported. Supported transition from ${
        ohm.status
      } ${
        allowedTransitions.length > 1 ? "are" : "is"
      } ${allowedTransitions.join(", ")}`,
      400
    );
  }

  const history = [...(ohm.history || [])];

  history.push({
    status,
    at: Date.now(),
  });

  return update(ohm.trackingId, { status, history });
}

async function updateOhmComment(ohm, comment) {
  if (!statusComments.includes(ohm.status)) {
    throw new HttpError("Cannot add comment to not finalised order", 400);
  }

  return update(ohm.trackingId, { comment });
}

async function getOhm(trackingId) {
  const ohm = await find(trackingId);

  return ohm;
}

async function updateOhm(trackingId, { status, comment }) {
  let ohm = await find(trackingId);

  if (status) {
    ohm = await updateOhmStatus(ohm, status);
  } else if (comment) {
    ohm = await updateOhmComment(ohm, comment);
  } else {
    throw new HttpError("Missing status or comment", 400);
  }

  return ohm;
}

async function copyOhm(trackingId) {
  const { description, client } = await find(trackingId);
  const status = STATUS.CREATED;
  const ohm = await add({
    status,
    comment: null,
    description,
    client,
    history: [
      {
        status,
        at: Date.now(),
      },
    ],
  });

  return ohm;
}

async function createOhm({ description, client } = {}) {
  if (!description || !description.volts || !description.amperes) {
    throw new HttpError("Missing product description", 400);
  }

  if (!client || !client.name || !client.address) {
    throw new HttpError("Missing client details", 400);
  }

  const status = STATUS.CREATED;
  const ohm = await add({
    status,
    comment: null,
    description,
    client,
    history: [
      {
        status,
        at: Date.now(),
      },
    ],
  });

  return ohm;
}

module.exports = {
  getOhm,
  updateOhm,
  createOhm,
  copyOhm,
};
