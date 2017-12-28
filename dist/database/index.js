'use strict';

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = "mongodb://localhost:27017";

_mongoose2.default.connect(url, { useMongoClient: true }, function (err) {
    console.log(err ? err : "Connected");
});
//# sourceMappingURL=index.js.map