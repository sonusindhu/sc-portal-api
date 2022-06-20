/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝
  "/logout": "/api/v1/account/logout",

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.
  "/api/v1/auth/logout": { action: "auth/logout" },
  "POST /api/v1/auth/login": { action: "auth/login" },
  "POST /api/v1/auth/signup": { action: "auth/signup" },
  "POST /api/v1/user/update-password": { action: "user/updateUserPassword" },
  "POST /api/v1/user/update-profile": { action: "user/updateProfile" },

  "POST /api/v1/auth/send-password": { action: "auth/sendpassword" },
  "POST /api/v1/auth/update-password": { action: "auth/updatepassword" },

  // Common Routes
  "GET /api/v1/app/common/getEquipments": { action: "common/getEquipments" },
  "GET /api/v1/app/common/getCargos": { action: "common/getCargos" },
  "GET /api/v1/app/common/getCommodities": { action: "common/getCommodities" },

  // Company Routes
  "POST /api/v1/app/company/create": { action: "company/create" },
  "POST /api/v1/app/company/update": { action: "company/update" },
  "GET /api/v1/app/company/find/:id": { action: "company/findById" },
  "POST /api/v1/app/company/list": { action: "company/listView" },
  "GET /api/v1/app/company/listOfNames": { action: "company/listOfNames" },
  "DELETE /api/v1/app/company/delete/:id": { action: "company/delete" },
  "POST /api/v1/app/company/deleteRange": { action: "company/deleteRange" },

  // Contact Routes
  "POST /api/v1/app/contact/create": { action: "contact/create" },
  "POST /api/v1/app/contact/update": { action: "contact/update" },
  "GET /api/v1/app/contact/find/:id": { action: "contact/findById" },
  "POST /api/v1/app/contact/list": { action: "contact/listView" },
  "DELETE /api/v1/app/contact/delete/:id": { action: "contact/delete" },
  "POST /api/v1/app/contact/deleteRange": { action: "contact/deleteRange" },

  // Contact Routes
  "POST /api/v1/app/inventory/create": { action: "inventory/create" },
  "POST /api/v1/app/inventory/update": { action: "inventory/update" },
  "GET /api/v1/app/inventory/find/:id": { action: "inventory/findById" },
  "POST /api/v1/app/inventory/list": { action: "inventory/listView" },
  "DELETE /api/v1/app/inventory/delete/:id": { action: "inventory/delete" },
  "POST /api/v1/app/inventory/deleteRange": { action: "inventory/deleteRange" },

  // Quote Routes
  "POST /api/v1/app/quote/create": { action: "quote/create" },
  "POST /api/v1/app/quote/update": { action: "quote/update" },
  "GET /api/v1/app/quote/find/:id": { action: "quote/findById" },
  "GET /api/v1/app/quote/getQuoteDetails/:id": {
    action: "quote/getQuoteDetails",
  },
  "POST /api/v1/app/quote/list": { action: "quote/listView" },
  "DELETE /api/v1/app/quote/delete/:id": { action: "quote/delete" },
  "POST /api/v1/app/quote/deleteRange": { action: "quote/deleteRange" },
  "GET /api/v1/app/quote/getCompanies": { action: "quote/getCompanies" },
  "GET /api/v1/app/quote/getContactsByCompany/:id": {
    action: "quote/getContactsByCompany",
  },
};
