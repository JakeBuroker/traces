const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");

router.get("/", (req, res) => {
    pool
      .query('SELECT * from "evidence";')
      .then((result) => {
        res.send(result.rows);
      })
      .catch((error) => {
        console.log("Error GET /api/evidence", error);
        res.sendStatus(500);
      });
  });

module.exports = router;