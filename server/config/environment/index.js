"use strict";

let path = require("path");
let _ = require("lodash");

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error("You must set the " + name + " environment variable");
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
let all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + "/../../.."),

  uploads: path.join(path.normalize(__dirname + "/../../.."), "server/uploads"),
  uploadPath: path.join(path.normalize(__dirname + "/../../.."), "server/uploads/images"),
  thumbnailsPath: path.join(path.normalize(__dirname + "/../../.."), "server/uploads/thumbnails"),
  audioPath: path.join(path.normalize(__dirname + "../../../.."), "server/uploads/audio"),
  assetImages: path.join(path.normalize(__dirname + "../../../.."), "server/uploads/assetImages"),
  assetDocuments: path.join(path.normalize(__dirname + "../../../.."), "server/uploads/assetDocuments"),
  giTestForms: path.join(path.normalize(__dirname + "../../../.."), "server/uploads/giTestForms"),
  // Server port
  port: process.env.PORT || 4010,

  // Server IP
  ip: process.env.IP || "11.11.11.52",

  // Should we populate the DB with sample data?
  //seedDB: true, // this should come from enviornment specific configuraiton such as "development.js" or "production.js"

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: "pms-secret-word",
  },

  // List of user roles
  userRoles: ["guest", "user", "admin"],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true,
      },
    },
  },
  email: {
    host: "smtp.office365.com",
    port: 587,
    provider: "",
    user: "TIMPS.Alerts@tektracking.com",
    pass: "TIMPS$Account",
    errors: {
      no_recipient: "The message must have at least one recipient.",
    },
  },
};

// Export the config object based on the NODE_ENV
// ==============================================
//module.exports =all;

module.exports = _.merge(all, require("./"+(process.env.NODE_ENV || "development")+".js") || {});
