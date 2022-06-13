/**
 * QuoteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const QuoteService = require("../services/QuoteService");
const GridService = require("../services/GridService");

module.exports = {
  getCompanies: async (req, res) => {
    let companies = await Company.find().select(["id", "name"]);
    return res.send({
      status: true,
      message: `Companies fetched successfully.`,
      result: companies,
    });
  },

  getContactsByCompany: async (req, res) => {
    let contacts = await Contact.find({ companyId: req.param("id") }).select([
      "id",
      "fullName",
    ]);
    return res.send({
      status: true,
      message: `Contacts fetched successfully.`,
      result: contacts,
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
    const payload = QuoteService.mapPayload(data);
    payload.createdBy = req.token.id;

    const lastQuote = await Quote.find({ isDeleted: false })
      .sort([{ id: "desc" }])
      .limit(1)
      .select(["id"]);

    let oldId = 1;
    if (lastQuote && lastQuote.length > 0) {
      oldId = lastQuote[0].id + 1;
    }
    const dt = new Date();
    const uniqueId =
      dt.getFullYear() + "" + (dt.getMonth() + 1) + "" + dt.getDate();

    payload.quoteNumber = `Q${uniqueId}${oldId}`;

    let quote = await Quote.create(payload).fetch();
    const accessorials = await Accessorial.create({
      quoteId: quote.id,
    }).fetch();
    const origin = await Stop.create({
      quoteId: quote.id,
      type: "Shipper",
    }).fetch();
    const desination = await Stop.create({
      quoteId: quote.id,
      type: "Consignee",
    }).fetch();
    const cargoDetail = await CargoDetail.create({ quoteId: quote.id }).fetch();
    return res.send({
      status: true,
      message: "Quote has been successfully created.",
      result: {
        ...quote,
        accessorials: [accessorials],
        stops: [origin, desination],
        cargoDetail,
      },
    });
  },

  update: async (req, res) => {
    const data = req.body;
    const payload = QuoteService.mapPayload(data);
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

    const cargoPayload = QuoteService.mapCargoPayload(data.cargoDetail);
    await CargoDetail.update({ id: data.id }).set(cargoPayload);

    Quote.updateOne({ id: data.id })
      .set(payload)
      .exec(function (err, response) {
        if (err) {
          let message = "Form is not valid";
          return res.send({ status: false, message, err });
        }
        return res.send({
          status: true,
          message: "Quote has been updated successfully.",
          result: response,
        });
      });
  },

  getQuoteDetails: async (req, res) => {
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

  findById: async (req, res) => {
    // Look up the user with this reset token.
    let quote = await Quote.findOne({ id: req.param("id") })
      .populate("stops")
      .populate("accessorials");

    // If no such user exists, or their token is expired, bail.
    if (!quote) {
      return res.send({
        status: false,
        message: `Quote doesn't exist or deleted.`,
      });
    }

    const cargoDetail = await CargoDetail.findOne({ quoteId: req.param("id") });
    quote.cargoDetail = cargoDetail || {};

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
