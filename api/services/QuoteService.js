// Quote Service

module.exports = {
  mapPayload: (quote) => {
    return {
      name: quote.name,
      service: quote.service,
      transportMode: quote.transportMode.join(","),
      expiryDate: quote.expiryDate,
      company: quote.companyId,
      contact: quote.contactId,
    };
  },
};
