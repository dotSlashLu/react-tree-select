"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PATH_DELIM = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _DslTreeSelectSearchInput = require("./DslTreeSelectSearchInput");

var _DslTreeSelectSearchInput2 = _interopRequireDefault(_DslTreeSelectSearchInput);

var _DslTreeSelectNode = require("./DslTreeSelectNode");

var _DslTreeSelectNode2 = _interopRequireDefault(_DslTreeSelectNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PATH_DELIM = "=>";

var DslTreeSelect = function (_React$Component) {
  _inherits(DslTreeSelect, _React$Component);

  function DslTreeSelect() {
    var _ref;

    _classCallCheck(this, DslTreeSelect);

    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = DslTreeSelect.__proto__ || Object.getPrototypeOf(DslTreeSelect)).call.apply(_ref, [this].concat(props)));

    _this.state = {
      conf: {
        labelKey: "name",
        valueKey: "value"
      },
      searching: false,
      searchKeyword: null,
      index: [],
      selected: []
    };
    return _this;
  }

  _createClass(DslTreeSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setConfig(this.props);
      this.buildIndex(this.props.data);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      //// is it necessary to respond to conf change?
      this.setConfig(nextProps);
      if (nextProps.data != this.props.data) this.buildIndex(nextProps.data);
    }
  }, {
    key: "buildIndex",
    value: function buildIndex(data) {
      var _this2 = this;

      if (!data || !data.length) return [];

      var indexes = [];

      var buildPath = function buildPath(path, node) {
        var label = node[_this2.state.conf["labelKey"]];

        if (!path) path = label;else path += PATH_DELIM + label;

        if (!node.children) return indexes.push(path);

        node.children.forEach(function (child) {
          buildPath(path, child);
        });
      };

      data.forEach(function (datum) {
        buildPath("", datum);
      });

      // console.debug("generated indexes", indexes);
      this.setState({
        index: indexes
      });
    }
  }, {
    key: "setConfig",
    value: function setConfig(props) {
      var searchExpandAll = false;
      if (props.hasOwnProperty("searchExpandAll")) searchExpandAll = props.searchExpandAll;else if (props.selectMode == "leaf") searchExpandAll = true;

      var conf = {
        labelKey: props.labelKey,
        valueKey: props.valueKey,
        selectMode: props.selectMode,
        // immature, now all siblings will be expanded
        // searchExpandAll: searchExpandAll,
        searchExpandAll: false,
        multi: props.multi,
        expandIconClassNames: props.expandIconClassNames,
        collapseIconClassNames: props.collapseIconClassNames
      };
      this.setState({
        conf: conf
      });
    }
  }, {
    key: "setMatchedPath",
    value: function setMatchedPath(keyword, path) {
      console.debug("setting matchedPath", path);
      if (!keyword) return this.setState({
        searchKeyword: null,
        matchedPath: null
      });

      this.setState({
        matchedPath: path,
        searchKeyword: keyword,
        searching: true
      });
    }
  }, {
    key: "selectHandler",
    value: function selectHandler(value) {
      var deselect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // only one selection allowed
      var selected = [];

      if (!this.props.multi) {
        if (deselect) selected = null;else selected = value;
      } else {
        var state = this.state.selected;
        if (deselect) selected = [].concat(_toConsumableArray(state)).splice(state.indexOf(value), 1);else selected = [].concat(_toConsumableArray(state), [value]);
      }

      console.debug("selected:", selected);
      this.setState({
        selected: selected
      });
      return this.props.changeHandler(selected);
    }
  }, {
    key: "addIndex",
    value: function addIndex(idx) {
      this.setState({
        index: [].concat(_toConsumableArray(this.state.index), [idx])
      });
    }
  }, {
    key: "setSearching",
    value: function setSearching(state) {
      this.setState({
        searching: state
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        "div",
        { className: "dsl-ts" },
        _react2.default.createElement(_DslTreeSelectSearchInput2.default, {
          className: this.props.searchInputClassNames,
          setMatchedPath: this.setMatchedPath.bind(this),
          searchTriggerTimeout: this.props.searchTriggerTimeout,
          placeholder: this.props.searchInputPlaceholder,
          index: this.state.index
        }),
        _react2.default.createElement(
          "div",
          { className: "dsl-ts-tree" },
          this.props.data.map(function (datum, idx) {
            return _react2.default.createElement(_DslTreeSelectNode2.default, {
              key: "0-" + idx,
              root: datum,
              conf: _this3.state.conf,
              depth: 0,
              path: datum[_this3.state.conf["labelKey"]],
              matchedPath: _this3.state.matchedPath,
              searchKeyword: _this3.state.searchKeyword,
              searching: _this3.state.searching,
              expand: false,
              selectedValue: _this3.state.selected,

              selectHandler: _this3.selectHandler.bind(_this3)
            });
          })
        )
      );
    }
  }]);

  return DslTreeSelect;
}(_react2.default.Component);

DslTreeSelect.propTypes = {
  // tree data
  data: _react2.default.PropTypes.array.isRequired,
  // selected nodes
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.string]),
  // default: "value"
  valueKey: _react2.default.PropTypes.string,
  // default: "name"
  labelKey: _react2.default.PropTypes.string,
  wrapperClassNames: _react2.default.PropTypes.string,
  treeClassNames: _react2.default.PropTypes.string,
  expandIconClassNames: _react2.default.PropTypes.string,

  // whether multiple selection is allowed
  // default: false
  multi: _react2.default.PropTypes.bool,

  // enable search function
  // default: true
  search: _react2.default.PropTypes.bool,
  searchTriggerTimeout: _react2.default.PropTypes.number,
  // expand a matched node to leaf,
  // default is true if selectMode is "leaf", otherwise false
  searchExpandAll: _react2.default.PropTypes.bool,

  searchInputClassNames: _react2.default.PropTypes.string,

  changeHandler: _react2.default.PropTypes.func,

  // which level can be selected
  // default: "leaf"
  selectMode: function selectMode(props, propName, componentName) {
    var p = props[propName],
        opts = ["node", // all nodes can be selected, this is the default value

    "leaf", // only selecting on leaf nodes is allowed

    "deep"];

    // n-only mode, only nodes of level n can be selected
    if (p && opts.indexOf(p) == -1 && !p.match(/\d+\-only/)) return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. `' + componentName + '` should be one of' + 'node/leaf/deep/{n}-only, where n is a number.');
  }
};

DslTreeSelect.defaultProps = {
  valueKey: "value",
  labelKey: "name",
  multi: false,
  search: false,
  selectMode: "leaf",
  searchTriggerTimeout: 500,
  expandIconClassNames: "glyphicon glyphicon-plus",
  collapseIconClassNames: "glyphicon glyphicon-minus"
};

exports.default = DslTreeSelect;
exports.PATH_DELIM = PATH_DELIM;