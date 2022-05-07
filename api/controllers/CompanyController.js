/**
 * CompanyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const CompanyService = require("../services/CompanyService");

module.exports = {
  listView: async (req, res) => {
    const payload = req.body;

    const companies = await Company.find()
      .limit(payload.take)
      .skip(payload.skip);
    const total = await Company.count();
    return res.send({
      status: false,
      message: `Company list fetched successfully.`,
      result: companies,
      total,
    });
  },

  create: async (req, res) => {
    const data = req.body;
    const payload = CompanyService.mapCompanyPayload(data);
    payload.createdBy = req.token.id;

    // Look up the user with this reset token.
    const companyByName = await Company.findOne({ name: data.name });
    // If no such user exists, or their token is expired, bail.
    if (companyByName) {
      return res.send({
        status: false,
        message: `Company name is already taken.`,
      });
    }

    // Look up the user with this reset token.
    const companyByEmail = await Company.findOne({ email: data.email });
    // If no such user exists, or their token is expired, bail.
    if (companyByEmail) {
      return res.send({
        status: false,
        message: `Company email is already taken.`,
      });
    }

    Company.create(payload).exec(function (err, response) {
      if (err) {
        let message = "Form doesn't valid";
        if (err.code == "E_UNIQUE") {
          message = "Email is already exists";
        }
        return res.send({ status: false, message, err });
      }
      return res.send({
        status: false,
        message: "Company has been successfully created.",
        result: response,
      });
    });
  },

  update: async (req, res) => {
    const data = req.body;
    const payload = CompanyService.mapCompanyPayload(data);
    payload.updatedBy = req.token.id;

    // Look up the user with this reset token.
    const company = await Company.findOne({ id: data.id });

    // If no such user exists, or their token is expired, bail.
    if (!company) {
      return res.send({
        status: false,
        message: `Company doesn't exist or deleted.`,
      });
    }

    // Look up the user with this reset token.
    const companyByName = await Company.findOne({
      id: { "!=": data.id },
      name: data.name,
    });
    // If no such user exists, or their token is expired, bail.
    if (companyByName) {
      return res.send({
        status: false,
        message: `Company name is already taken.`,
      });
    }

    // Look up the user with this reset token.
    const companyByEmail = await Company.findOne({
      id: { "!=": data.id },
      email: data.email,
    });
    // If no such user exists, or their token is expired, bail.
    if (companyByEmail) {
      return res.send({
        status: false,
        message: `Company email is already taken.`,
      });
    }

    Company.updateOne({ id: data.id })
      .set(payload)
      .exec(function (err, response) {
        if (err) {
          let message = "Form is not valid";
          if (err.code == "E_UNIQUE") {
            message = "Email is already exists";
          }
          return res.send({ status: false, message, err });
        }
        return res.send({
          status: false,
          message: "Company has been updated successfully.",
          result: response,
        });
      });
  },

  findById: async (req, res) => {
    // Look up the user with this reset token.
    const company = await Company.findOne({ id: req.param("id") });

    // If no such user exists, or their token is expired, bail.
    if (!company) {
      return res.send({
        status: false,
        message: `Company doesn't exist or deleted.`,
      });
    }

    return res.send({
      status: true,
      message: "Company has been fetched successfully.",
      result: company,
    });
  },

  delete: async () => {},
};
