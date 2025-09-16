const app = require('./app');
const sequelize = require('./config/database');
const { createAdmin } = require("./services/auth.services");
require('module-alias/register');

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log("Database connected");
    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    // seed admin from .env
    await createAdmin(
      process.env.ADMIN_NAME,
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_PASSWORD
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
  });
