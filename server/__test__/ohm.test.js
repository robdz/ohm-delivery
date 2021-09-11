const ohmService = require("../src/service/ohm");

describe("db return ohm", () => {
  let trackingId;
  const description = { amperes: 12, volts: 6 };
  const client = { name: "Test", address: "Test" };

  it("returns Ohm object", async () => {
    const ohm = await ohmService.getOhm("1e62adfe");
    expect(ohm).toBeDefined();
  });

  it("has a valid history", async () => {
    const ohm = await ohmService.getOhm("1e62adfe");
    const statuses = [
      "CREATED",
      "PREPARING",
      "READY",
      "IN_DELIVERY",
      "DELIVERED",
      "REFUSED",
    ];
    const isValidStatus = statuses.includes(ohm.history[0].state);
    expect(isValidStatus).toBe(true);
  });

  it("adds new order", async () => {
    const ohm = await ohmService.createOhm({ description, client });

    expect(ohm.client).toBe(client);
    expect(ohm.description).toBe(description);
    expect(ohm.trackingId).toBeTruthy();
    expect(ohm.status).toBe("CREATED");
    expect(ohm.history).toHaveLength(1);

    trackingId = ohm.trackingId;
  });

  it("order copied based on previous trackingId", async () => {
    const ohm = await ohmService.copyOhm(trackingId);

    expect(ohm.client).toBe(client);
    expect(ohm.description).toBe(description);
    expect(ohm.trackingId).toBeTruthy();
    expect(ohm.status).toBe("CREATED");
    expect(ohm.history).toHaveLength(1);
  });

  it("can change status", async () => {
    const ohm = await ohmService.updateOhm(trackingId, { status: "PREPARING" });
    expect(ohm.status).toBe("PREPARING");
  });

  it("fails on unsupported status change", async () => {
    await expect(
      ohmService.updateOhm(trackingId, { status: "PREPARING" })
    ).rejects.toThrow();
  });
});
