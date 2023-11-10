const { User } = require('../models');

const userData =
[
  {  username: "leo", password: "ad12345", email: "leo@example.com" },
  {  username: "sarah", password: "password1", email: "sarah@example.com" },
  {  username: "zach", password: "zacPW12", email: "zach@example.com" },
  {  username: "emily", password: "password123", email: "emily@example.com" },
  {  username: "john", password: "1234567", email: "john@example.com" }
]

const seedUsers = () => User.bulkCreate(userData)
;

module.exports = seedUsers;