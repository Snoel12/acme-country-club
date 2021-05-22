const express = require("express");
const app = express();
const {
  conn,
  syncAndSeed,
  models: { Facility, Member, Booking },
} = require("./db");

app.get("/api/facilities", async (req, res) => {
  res.send(
    await Facility.findAll({
      include: [Booking],
    })
  );
});

app.get("/api/bookings", async (req, res) => {
  res.send(
    await Booking.findAll({
      include: [Facility, Member],
    })
  );
});

const doIt = async () => {
  await syncAndSeed();
  const port = 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

doIt();
