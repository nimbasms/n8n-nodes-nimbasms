"use strict";
const NimbaSMS = require('./nodes/NimbaSMS.node.js');
const NimbaSmsApi = require('./nodes/NimbaSmsApi.credentials.js');

module.exports = {
  nodes: [NimbaSMS],
  credentials: [NimbaSmsApi],
};
