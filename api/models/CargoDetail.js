/**
 * CargoDetail.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "cargo_details",
  migrate: "alter",

  attributes: {
    equipmentId: {
      model: "equipment",
    },
    commodityId: {
      model: "commodity",
    },
    weight: {
      type: "number",
      maxLength: 6,
    },
    cargoCalue: {
      type: "number",
      maxLength: 12,
    },
    temperature: {
      type: "number",
      maxLength: 3,
    },
    pieces: {
      type: "number",
      maxLength: 5,
    },
    isHazmat: {
      type: "boolean",
      allowNull: true,
      defaultsTo: false,
    },
    hazmatName: {
      type: "string",
      allowNull: true,
    },
    hazmatClass: {
      type: "string",
      allowNull: true,
    },
    hazmatUN: {
      type: "string",
      allowNull: true,
    },
    status: {
      type: "string",
      maxLength: 10,
      allowNull: true,
    },
    cargoTypeId: {
      model: "cargoType",
    },
    quoteId: {
      model: "quote",
    },
    createdBy: {
      model: "user",
    },
    updatedBy: {
      model: "user",
    },
    isDeleted: {
      type: "boolean",
      allowNull: true,
      defaultsTo: false,
    },
  },
};
