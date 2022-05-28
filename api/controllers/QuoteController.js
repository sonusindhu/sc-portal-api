/**
 * QuoteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const QuoteService = require("../services/QuoteService");
const GridService = require("../services/GridService");

module.exports = {
  listOfNames: async (req, res) => {
    let companies = await Quote.find().select(["id", "name"]);
    return res.send({
      status: true,
      message: `Quote list fetched successfully.`,
      result: companies,
    });
  },

  listView: async (req, res) => {
    const payload = req.body;
    const sortMap = payload.sort.join(",");
    const sort = sortMap || `createdAt desc`;
    const filterQuery = GridService.mapListFilterSql(payload.filter);
    const query = `SELECT * FROM view_quote_list ${filterQuery} ORDER BY ${sort} LIMIT ${payload.skip}, ${payload.take}`;
    const data = await sails.sendNativeQuery(query).intercept((err) => {
      return res.send({
        status: false,
        message: err?.raw?.error?.sqlMessage || err.code,
      });
    });
    return res.send({
      status: true,
      message: `Quote list fetched successfully.`,
      result: data?.rows || [],
      total: data?.rows?.length,
    });
  },

  create: async (req, res) => {
    const data = req.body;
    const payload = QuoteService.mapQuotePayload(data);
    payload.createdBy = req.token.id;

    // Look up the user with this reset token.
    const quoteByName = await Quote.findOne({ name: data.name });
    // If no such user exists, or their token is expired, bail.
    if (quoteByName) {
      return res.send({
        status: false,
        message: `Quote name is already taken.`,
      });
    }

    // Look up the user with this reset token.
    const quoteByEmail = await Quote.findOne({ email: data.email });
    // If no such user exists, or their token is expired, bail.
    if (quoteByEmail) {
      return res.send({
        status: false,
        message: `Quote email is already taken.`,
      });
    }

    Quote.create(payload).exec(async (err) => {
      if (err) {
        let message = "Form doesn't valid";
        if (err.code == "E_UNIQUE") {
          message = "Email is already exists";
        }
        return res.send({ status: false, message, err });
      }

      const quote = await Quote.findOne({ email: payload.email });
      return res.send({
        status: true,
        message: "Quote has been successfully created.",
        result: quote,
      });
    });
  },

  update: async (req, res) => {
    const data = req.body;
    const payload = QuoteService.mapQuotePayload(data);
    payload.updatedBy = req.token.id;

    // Look up the user with this reset token.
    const quote = await Quote.findOne({ id: data.id });

    // If no such user exists, or their token is expired, bail.
    if (!quote) {
      return res.send({
        status: false,
        message: `Quote doesn't exist or deleted.`,
      });
    }

    // Look up the user with this reset token.
    const quoteByName = await Quote.findOne({
      id: { "!=": data.id },
      name: data.name,
    });
    // If no such user exists, or their token is expired, bail.
    if (quoteByName) {
      return res.send({
        status: false,
        message: `Quote name is already taken.`,
      });
    }

    // Look up the user with this reset token.
    const quoteByEmail = await Quote.findOne({
      id: { "!=": data.id },
      email: data.email,
    });
    // If no such user exists, or their token is expired, bail.
    if (quoteByEmail) {
      return res.send({
        status: false,
        message: `Quote email is already taken.`,
      });
    }

    Quote.updateOne({ id: data.id })
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
          status: true,
          message: "Quote has been updated successfully.",
          result: response,
        });
      });
  },

  findById: async (req, res) => {
    // Look up the user with this reset token.
    const quote = await Quote.findOne({ id: req.param("id") });

    // If no such user exists, or their token is expired, bail.
    if (!quote) {
      return res.send({
        status: false,
        message: `Quote doesn't exist or deleted.`,
      });
    }

    return res.send({
      status: true,
      message: "Quote has been fetched successfully.",
      result: quote,
    });
  },

  delete: async (req, res) => {
    Quote.destroyOne({ id: req.param("id") }).exec(function (err) {
      return res.send({
        status: true,
        message: "Quote has been deleted successfully.",
      });
    });
  },

  deleteRange: async (req, res) => {
    if (req.body && req.body.ids && req.body.ids.length) {
      const ids = req.body.ids;
      Quote.destroy(ids).exec(() => {
        return res.send({
          status: true,
          message: "Quote(s) have been deleted successfully.",
        });
      });
    }

    return res.send({
      status: true,
      message: "Quote(s) have been deleted successfully.",
    });
  },
};
