/**
 * User.js
 *
 * A user who can log in to this application.
 */

const bcrypt = require("bcrypt");

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: "mary.sue@example.com",
    },

    password: {
      type: "string",
      required: true,
      description:
        "Securely hashed representation of the user's login password.",
      protect: true,
      example: "2$28a8eabna301089103-13948134nad",
    },

    firstName: {
      type: "string",
      required: true,
      description: "Full representation of the user's first name.",
      maxLength: 120,
      example: "Sonu",
    },

    lastName: {
      type: "string",
      required: true,
      description: "Full representation of the user's name.",
      maxLength: 120,
      example: "Sindhu",
    },

    fullName: {
      type: "string",
      description: "Full representation of the user's name.",
      maxLength: 255,
      example: "Sonu Sindhu",
    },

    isSuperAdmin: {
      type: "boolean",
      description:
        'Whether this user is a "super admin" with extra permissions, etc.',
    },

    isAdmin: {
      type: "boolean",
      description:
        'Whether this user is a "admin" with extra permissions, etc.',
    },

    passwordResetToken: {
      type: "string",
      description:
        "A unique token used to verify the user's identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.",
    },

    passwordResetTokenExpiresAt: {
      type: "number",
      description:
        "A JS timestamp (epoch ms) representing the moment when this user's `passwordResetToken` will expire (or 0 if the user currently has no such token).",
      example: 1502844074211,
    },

    emailProofToken: {
      type: "string",
      description:
        "A pseudorandom, probabilistically-unique token for use in our account verification emails.",
    },

    emailProofTokenExpiresAt: {
      type: "number",
      description:
        "A JS timestamp (epoch ms) representing the moment when this user's `emailProofToken` will expire (or 0 if the user currently has no such token).",
      example: 1502844074211,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a
  },

  // Here we encrypt password before creating a User
  beforeCreate(values, next) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        sails.log.error(err);
        return next();
      }

      bcrypt.hash(values.password, salt, (err, hash) => {
        if (err) {
          sails.log.error(err);
          return next();
        }
        values.password = hash; // Here is our encrypted password
        return next();
      });
    });
  },

  comparePassword(password, encryptedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, encryptedPassword, (err, match) => {
        if (err) {
          return reject(err);
        }
        if (match) return resolve();
        return reject("Mismatch passwords");
      });
    });
  },
};
