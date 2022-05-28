// Quote Service

module.exports = {
  mapPayload: (quote) => {
    return {
      name: quote.name,
      services: quote.services,
      transportMode: quote.transportMode,
      status: quote.status,
      totalCost: quote.totalCost,
      totalProfit: quote.totalProfit,
      expiryDate: quote.expiryDate,
      company: quote.companyId,
      contact: quote.contactId,
    };
  },
};
