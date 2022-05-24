/**
 * InventoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const InventoryService = require("../services/InventoryService");

module.exports = {
  listView: async (req, res) => {
    const payload = req.body;
    const sort = payload.sort.length > 0 ? payload.sort : [{ id: "asc" }];

    const filter = payload.filter;
    let filterQuery;
    if (filter?.filters?.length) {
      filterQuery = GridService.createQueryFromFilter(
        filter.filters,
        filter.logic
      );
    }

    let inventories;
    if (filterQuery) {
      inventories = await Inventory.find({
        where: filterQuery,
      })
        .populate("company")
        .populate("createdBy")
        .populate("updatedBy")
        .sort(sort)
        .skip(payload.skip)
        .limit(payload.take);
    } else {
      inventories = await Inventory.find()
        .populate("company")
        .populate("createdBy")
        .populate("updatedBy")
        .sort(sort)
        .skip(payload.skip)
        .limit(payload.take);
    }

    if (inventories && inventories.length) {
      inventories = inventories.map((inventory) => {
        return {
          ...inventory,
          companyId: inventory.company?.id || null,
          company: inventory.company?.name || "",
          createdBy: inventory.createdBy?.fullName || "",
          updatedBy: inventory.updatedBy?.fullName || "",
          updatedAt: inventory.updatedBy?.id ? inventory.updatedAt : null,
        };
      });
    }

    const total = await Inventory.count();
    return res.send({
      status: true,
      message: `Inventory list fetched successfully.`,
      result: inventories,
      total,
    });
  },

  create: async (req, res) => {
    const data = req.body;
    const payload = InventoryService.mapInventoryPayload(data);
    payload.createdBy = req.token.id;

    const inventoryByEmail = await Inventory.findOne({
      trackingNumber: payload.trackingNumber,
    });
    if (inventoryByEmail) {
      return res.send({
        status: false,
        message: `Inventory tracking number is already taken.`,
      });
    }

    const lastInventory = await Inventory.find()
      .sort([{ id: "desc" }])
      .limit(1)
      .select(["id"]);

    let oldId = 1;
    if (lastInventory && lastInventory.length > 0) {
      oldId = lastInventory[0].id + 1;
    }

    const dt = new Date();
    const uniqueId =
      dt.getFullYear() + "" + (dt.getMonth() + 1) + "" + dt.getDate();

    payload.packageId = `PID${uniqueId}${oldId}`;

    Inventory.create(payload).exec(async (err) => {
      if (err) {
        let message = "Form doesn't valid";
        if (err.code == "E_UNIQUE") {
          message = "Email is already exists";
        }
        return res.send({ status: false, message, err });
      }

      const inventory = await Inventory.findOne({
        trackingNumber: payload.trackingNumber,
      });
      return res.send({
        status: true,
        message: "Inventory has been successfully created.",
        result: inventory,
      });
    });
  },

  update: async (req, res) => {
    const data = req.body;
    const payload = InventoryService.mapInventoryPayload(data);
    payload.updatedBy = req.token.id;

    const inventory = await Inventory.findOne({ id: data.id });
    if (!inventory) {
      return res.send({
        status: false,
        message: `Inventory doesn't exist or deleted.`,
      });
    }

    // Look up the user with this reset token.
    const inventoryByName = await Inventory.findOne({
      id: { "!=": data.id },
      trackingNumber: payload.trackingNumber,
    });
    // If no such user exists, or their token is expired, bail.
    if (inventoryByName) {
      return res.send({
        status: false,
        message: `Inventory tracking number is already taken.`,
      });
    }

    Inventory.updateOne({ id: data.id })
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
          message: "Inventory has been updated successfully.",
          result: response,
        });
      });
  },

  findById: async (req, res) => {
    // Look up the user with this reset token.
    const inventory = await Inventory.findOne({ id: req.param("id") });

    // If no such user exists, or their token is expired, bail.
    if (!inventory) {
      return res.send({
        status: false,
        message: `Inventory doesn't exist or deleted.`,
      });
    }

    return res.send({
      status: true,
      message: "Inventory has been fetched successfully.",
      result: inventory,
    });
  },

  delete: async (req, res) => {
    Inventory.stroyOne({ id: req.param("id") }).exec(function (err) {
      return res.send({
        status: true,
        message: "Inventory has been delete successfully.",
      });
    });
  },

  deleteRange: async (req, res) => {
    if (req.body && req.body.ids && req.body.ids.length) {
      const ids = req.body.ids;
      Inventory.stroy(ids).exec(() => {
        return res.send({
          status: true,
          message: "Inventory(ies) have been delete successfully.",
        });
      });
    }

    return res.send({
      status: true,
      message: "Inventory(ies) have been delete successfully.",
    });
  },
};
