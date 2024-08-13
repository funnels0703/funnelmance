//server.js

const app = require("./app");

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
