/**
 * Stop.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "stops",
  migrate: "alter",

  attributes: {
    type: {
      type: "string",
      maxLength: 10,
    },
    title: {
      type: "string",
      maxLength: 100,
    },
    message: {
      type: "string",
      maxLength: 5000,
    },
    isCritical: {
      type: "boolean",
      defaultsTo: false,
      allowNull: true,
    },
    quoteId: {
      model: "quote",
      allowNull: true,
    },
    contactId: {
      model: "contact",
      allowNull: true,
    },
    companyId: {
      model: "company",
      allowNull: true,
    },
    inventoryId: {
      model: "inventory",
      allowNull: true,
    },
    userId: {
      model: "user",
    },
  },
};
