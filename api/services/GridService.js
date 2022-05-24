// Grid Service

module.exports = {
  formatQueries: (filter, querries = []) => {
    switch (filter.operator) {
      case "contains":
        return {
          [`${filter.field}`]: {
            contains: filter.value,
          },
        };
      case "eq":
        return { [`${filter.field}`]: filter.value };
    }
    return querries;
  },
  createQueryFromFilter: (filters, logic, mainQuery = {}) => {
    let querries = {};
    for (let filter of filters) {
      if (filter.logic) {
        querries = module.exports.createQueryFromFilter(
          filter.filters,
          filter.logic
        );
        mainQuery[logic] = mainQuery[logic] || [];
        mainQuery[logic] = [...mainQuery[logic], querries];
      } else {
        mainQuery[logic] = mainQuery[logic] || [];
        mainQuery[logic] = [
          ...mainQuery[logic],
          module.exports.formatQueries(filter),
        ];
      }
    }
    return mainQuery;
  },
};
