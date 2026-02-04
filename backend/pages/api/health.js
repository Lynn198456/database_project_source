/* eslint-disable no-undef */
const applyCors = require("../../lib/cors");

module.exports = function handler(req, res) {
  if (applyCors(req, res)) return;
  res.status(200).json({ ok: true, service: "next-backend" });
};
