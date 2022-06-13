// Quote Service

module.exports = {
  mapPayload: (quote) => {
    return {
      name: quote.name,
      service: quote.service,
      transportMode: quote.transportMode,
      expiryDate: quote.expiryDate,
      company: quote.companyId,
      contact: quote.contactId,
    };
  },
  mapCargoPayload: (cargo) => {
    return {
      equipmentId: cargo.equipmentId,
      commodityId: cargo.commodityId,
      weight: cargo.weight,
      cargoValue: cargo.cargoValue,
      temperature: cargo.temperature,
      pieces: cargo.pieces,
      isHazmat: cargo.isHazmat,
      hazmatName: cargo.hazmatName,
      hazmatClass: cargo.hazmatClass,
      hazmatUN: cargo.hazmatUN,
      status: cargo.status,
      comments: cargo.comments,
      cargoTypeId: cargo.cargoTypeId,
      quoteId: cargo.quoteId,
    };
  },
};
