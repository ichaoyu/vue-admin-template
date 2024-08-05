const tableModuleGenerator = require('./plop/table/prompt.cjs');

module.exports = function (plop) {
  plop.setGenerator('table', tableModuleGenerator);
};
