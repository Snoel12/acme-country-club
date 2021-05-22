const Sequelize = require("sequelize");
const { STRING, UUID, UUIDV4, DATE, INTEGER } = Sequelize;
const conn = new Sequelize("postgres://localhost/coop_db");

const members = ["moe", "lucy", "larry", "ethyl"];
const facilities = ["tennis", "ping-pong", "raquet-ball", "bowling"];

const Facility = conn.define("facility", {
  name: { type: STRING, allowNull: false, unique: true },
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
});

const Member = conn.define("member", {
  name: { type: STRING, allowNull: false, unique: true },
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
});

const Booking = conn.define("booking", {
  startTime: {
    type: DATE,
    allowNull: false,
    defaultValue: function () {
      return new Date(new Date());
    },
  },
  endTime: {
    type: DATE,
    allowNull: false,
    defaultValue: function () {
      return new Date(new Date());
    },
  },
});
const date = new Date();

Facility.hasMany(Booking);
Booking.belongsTo(Facility);

Member.hasMany(Booking);
Booking.belongsTo(Member);

Member.hasMany(Member, { foreignKey: "sponsorId" });
Member.belongsTo(Member, { as: "sponsor" });

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [moe, lucy, larry, ethyl] = await Promise.all(
    members.map((name) => Member.create({ name }))
  );
  const [tennis, pingPong, raquetBall, bowling] = await Promise.all(
    facilities.map((name) => Facility.create({ name }))
  );
  await Promise.all([
    Booking.create({ facilityId: tennis.id, memberId: larry.id }),

    Booking.create({ facilityId: bowling.id, memberId: lucy.id }),

    Booking.create({ facilityId: pingPong.id, memberId: moe.id }),
  ]);
  larry.sponsorId = lucy.id;
  moe.sponsorId = lucy.id;
  ethyl.sponsorId = moe.id;

  await Promise.all([larry.save(), moe.save(), ethyl.save()]);
};

module.exports = {
  syncAndSeed,
  models: {
    Member,
    Facility,
    Booking,
  },
};
