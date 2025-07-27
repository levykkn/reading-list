require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  PUBLIC_DIR: require('path').join(__dirname, '..', '..', 'frontend'),
  // Add NODE_ENV to config, defaulting to 'production' for safety.
  NODE_ENV: process.env.NODE_ENV || 'production',
};
