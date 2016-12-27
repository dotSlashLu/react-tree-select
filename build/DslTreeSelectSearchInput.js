"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _DslTreeSelect = require("./DslTreeSelect");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DslTreeSelectSearchInput = function (_React$Component) {
  _inherits(DslTreeSelectSearchInput, _React$Component);

  function DslTreeSelectSearchInput() {
    var _ref;

    _classCallCheck(this, DslTreeSelectSearchInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = DslTreeSelectSearchInput.__proto__ || Object.getPrototypeOf(DslTreeSelectSearchInput)).call.apply(_ref, [this].concat(args)));

    _this.state = {
      value: ""
    };
    _this.searchTimer = null;
    return _this;
  }

  _createClass(DslTreeSelectSearchInput, [{
    key: "search",
    value: function search(val) {
      // console.debug(
      //   "searching for " + val,
      //   "index", this.props.index
      // );

      if (!val || !this.props.index) return this.props.setMatchedPath(null);

      var matchedSet = new Set();

      // loop through searchIndex and match
      this.props.index.forEach(function (path) {
        // console.debug(
        //   "matching against", path,
        //   "result", path.match(val)
        // );
        // TODO: escape regex special characters
        if (!path.match(new RegExp(val))) return;

        var delimIdx = path.indexOf(_DslTreeSelect.PATH_DELIM, path.lastIndexOf(val));
        var chain = path;
        if (delimIdx > 0) chain = path.substring(0, delimIdx);
        // let pattern = new RegExp("(" + val + ".*?)(->)?", "g");
        // matched = [...matched, chain.split(PATH_DELIM)];
        matchedSet.add(chain);
      });

      var matchedArr = [].concat(_toConsumableArray(matchedSet)),
          ret = {};

      matchedArr.forEach(function (path) {
        var arr = path.split(_DslTreeSelect.PATH_DELIM);
        arr.forEach(function (p, depth) {
          // TODO: eliminate this very unlikely condition
          if (!ret[depth]) ret[depth] = [];
          ret[depth].push([].concat(_toConsumableArray(arr)).splice(0, depth + 1).join(_DslTreeSelect.PATH_DELIM));
        });
      });

      this.props.setMatchedPath(val, ret);
    }
  }, {
    key: "changeHandler",
    value: function changeHandler(e) {
      var _this2 = this;

      var val = e.target.value;
      this.setState({ "value": val });

      if (this.searchTimer) clearTimeout(this.searchTimer);

      this.searchTimer = setTimeout(function () {
        // console.debug("begin search");
        _this2.search(val);
      }, this.props.searchTriggerTimeout);
    }
  }, {
    key: "render",
    value: function render() {
      var cls = (0, _classnames2.default)("dsl-ts-input", this.props.className);

      return _react2.default.createElement("input", {
        className: cls,
        readOnly: this.props.readOnly,
        placeholder: this.props.placeholder,
        value: this.state.value,
        onChange: this.changeHandler.bind(this) });
    }
  }]);

  return DslTreeSelectSearchInput;
}(_react2.default.Component);

exports.default = DslTreeSelectSearchInput;