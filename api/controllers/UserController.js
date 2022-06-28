"use strict";

const AuthService = require("../services/AuthService");

module.exports = {
  updateUserPassword: async (req, res) => {
    const { currentPassword, password, confirmPassword } = req.body;

    if (password != confirmPassword) {
      return res.send({
        status: false,
        message: "Password/confirm password doesn't matched.",
      });
    }

    // Look up the user with this reset token.
    const user = await User.findOne({ id: req.token.id });

    // If no such user exists, or their token is expired, bail.
    if (!user) {
      return res.send({
        status: false,
        message: "User's token has been invalid/expired.",
      });
    }

    User.comparePassword(password, user.password)
      .then(async () => {
        // Hash the new password.
        const hashed = await sails.helpers.passwords.hashPassword(password);

        // Store the user's new password and clear their reset token so it can't be used again.
        await User.updateOne({ id: req.token.id }).set({
          password: hashed,
          passwordResetToken: "",
          passwordResetTokenExpiresAt: 0,
        });

        return res.send({
          status: true,
          message: "Password has been changed successfully.",
        });
      })
      .catch((error) => {
        return res.send({
          status: false,
          message: "Please enter a valid current password",
        });
      });
  },

  updateProfile: async (req, res) => {
    const data = req.body;
    const userPayload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      jobTitle: data.jobTitle,
      department: data.department,
      location: data.location,
      phoneNumber: data.phoneNumber,
      extension: data.extension,
    };
    User.updateOne({ id: req.token.id })
      .set(userPayload)
      .exec(function (err, user) {
        if (err) {
          let message = "Form is not valid";
          if (err.code == "E_UNIQUE") {
            message = "Email is already exists";
          }
          res.send({ status: false, message, err });
        }
        return res.send({
          status: true,
          message: "User is successfully updated.",
          result: { ...userPayload, id: user.id },
        });
      });
  },

  getUserDetail: async (req, res) => {
    const user = await User.findOne({ id: req.token.id }).select([
      "email",
      "firstName",
      "lastName",
      "fullName",
      "jobTitle",
      "department",
      "location",
      "phoneNumber",
      "extension",
      "userImage",
    ]);
    return res.send({
      status: true,
      message: "User detail fetched successfully.",
      result: user,
    });
  },
};
