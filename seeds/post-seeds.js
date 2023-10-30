const { Post } = require("../models");

const postData = [
  {
    title: "Soccer GOAT",
    content: "Do you have time to talk about our lord and savior Ronaldinho Gaucho?",
    user_id: 1,
  },
  {
    title: "Why is MVC so important?",
    content: "MVC allows developers to maintain a true separation of concepts, devising their code between the Model layer for data, the View layer for design, and the Controller layer for application logic.",
    user_id: 2,
  },
  {
    title: "Test test1",
    content: "Hope this test works fine!",
    user_id: 3,
  },
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;