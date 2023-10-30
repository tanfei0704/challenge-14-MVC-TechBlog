const sequelize = require('../config/connection');

const seedUsers = require('./user-seeds');
const seedPosts= require('./post-seeds');
const seedComments = require('./comment-seeds');


const seedAll = async () => {

  await sequelize.sync({ force: true });

  await seedUsers();

  await seedPosts();
  
  await seedComments();
  
  console.log('Seeding process completed');

  process.exit(0);
};

seedAll();