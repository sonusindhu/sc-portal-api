"use strict";

const AuthService = require("../services/AuthService");

module.exports = {
  updateUserPassword: (req, res) => {},

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
