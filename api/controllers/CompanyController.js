/**
 * CompanyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  listView: async (req, res) => {},

  create: async (req, res) => {
    const userId = req.token.id;
    const data = req.body;
    const payload = {
      name: data.name,
      email: data.email,
      type: data.type,
      status: data.status,
      phone: data.phone,
      extension: data.extension,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country,
      employeesCount: data.employeesCount,
      revenue: data.revenue,
      createdBy: userId,
    };

    Company.create(payload).exec(function (err, user) {
      if (err) {
        let message = "Form is not valid";
        if (err.code == "E_UNIQUE") {
          message = "Email is already exists";
        }
        res.send({ status: false, message, err });
      }
      return res.send({
        status: false,
        message: "Company is successfully created.",
      });
    });
  },

  update: async () => {},

  findById: async () => {},

  delete: async () => {},
};
