require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  PUBLIC_DIR: require('path').join(__dirname, '..', '..', 'frontend'),
};