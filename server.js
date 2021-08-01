const app = require("./app");

app.listen(app.PORT, () => {
  console.log(`Backend is running on http://localhost:${app.PORT}`);
});
