"use strict";

const AuthService = require("../services/AuthService");

module.exports = {
  signup: async (req, res) => {
    const data = req.body;
    if (data.password !== data.confirmPassword) {
      return res.send({
        status: false,
        message: "Password/confirm password doesn't matched",
      });
    }
    const user = await User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
    }).intercept(({ message }) => {
      return res.send({ status: false, message });
    });
    if (user) {
      return res.send({
        status: false,
        message: "User is successfully created.",
      });
    }
    return res.send({ status: false, message: "No valid" });
  },

  login: async (req, res) => {
    const data = req.body;
    if (!data.email || !data.password) {
      return res.send({
        status: false,
        message: "Please enter valid email/password",
      });
    }
    const user = await User.findOne({ email: data.email }).intercept(
      ({ message }) => res.send({ status: false, message })
    );

    if (user) {
      User.comparePassword(data.password, user.password)
        .then(() => {
          res.send({
            data: {
              token: AuthService.generateAuthToken({ id: user.id }),
              fullName: user.fullName,
            },
            status: true,
            message: "User loggedin successfully.",
          });
        })
        .catch((error) => {
          res.send({
            status: false,
            message: "Please enter valid email/password",
          });
        });
    } else {
      res.send({
        status: false,
        message: "Please enter valid email/password",
      });
    }
  },

  logout: (req, res) => {
    res.send({ status: true, message: "logged-out successfully." });
  },
};
