const { User } = require('../models');

const userData =
[
  {
    username: "leo",
    password: "ad12345"
  },
  {
    username: "sarah",
    password: "password1"
  },
  {
    username: "zach",
    password: "zacPW12"
  },
  {
    username: "emily",
    password: "password123"
  },
  {
    username: "john",
    password: "1234567"
  }
]

const seedUsers = () => User.bulkCreate(userData)
;

module.exports = seedUsers;