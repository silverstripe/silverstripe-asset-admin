export default {
  parse: () => {},
  stringify: (params) => {
    // simple build query string to pass test
    let result = '';

    for (const prop of Object.keys(params)) {
      const join = result.length ? '&' : '';
      result = `${result}${join}${prop}=${params[prop]}`;
    }

    return result;
  },
};
