const { Permit } = require("permitio");
const express = require("express");

const app = express();
const port = 4000;

// Initialize Permit SDK
const permit = new Permit({
  pdp: "https://cloudpdp.api.permit.io",
  token: "permit_key_vf7ShBIbGuAkOSIIi7YwcWlhLABSeTN3DUZol8B2rVzzpjJINjFkf35mBFcdCYHiWYGVSG1m6Z5MQCoYAoVvvD",
});

app.get("/", async (req, res) => {
  const user = {
    key: "admin", // unique identifier
    first_name: "Admin",
    last_name: "User",
    email: "admin@example.com",
  };

  try {
    // Sync the user with Permit
    await permit.api.syncUser(user);

    // Now check permission
    const permitted = await permit.check(user.key, "summarize", "content");

    if (permitted) {
      res.send(`${user.first_name} is PERMITTED to 'summarize' 'content'!`);
    } else {
      res.status(403).send(`${user.first_name} is NOT PERMITTED to 'summarize' 'content'.`);
    }
  } catch (err) {
    console.error("Permission check failed:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`✅ Test app listening at http://localhost:${port}`);
});
