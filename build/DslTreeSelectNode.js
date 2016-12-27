"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _DslTreeSelect = require("./DslTreeSelect");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DslTreeSelectNode = function (_React$Component) {
  _inherits(DslTreeSelectNode, _React$Component);

  function DslTreeSelectNode() {
    var _ref;

    _classCallCheck(this, DslTreeSelectNode);

    for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = DslTreeSelectNode.__proto__ || Object.getPrototypeOf(DslTreeSelectNode)).call.apply(_ref, [this].concat(props)));

    _this.state = {
      label: "",
      // might not be fully expanded,
      // e.g. when searching, only matched children are shown
      expanded: false,
      fullyExpanded: false,
      searching: false,
      selected: false,
      shownChildren: []
    };
    return _this;
  }

  _createClass(DslTreeSelectNode, [{
    key: "__getShownChildren",
    value: function __getShownChildren(props) {
      var children = this.shownChildren(props);
      this.setState({ shownChildren: children });
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var value = this.props.root[this.props.conf.valueKey];
      var newState = {
        expanded: this.props.expand,
        searching: this.props.searching,
        selected: this.props.selectedValue == value
      };
      // if (this.props.hasOwnProperty("expand"))
      //   newState.expanded = this.props.expanded;

      // if (this.props.hasOwnProperty("searching"))
      //   newState.searching = this.props.searching;
      this.setState(newState, this.__getShownChildren);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var newState = {};

      if (nextProps.searchKeyword != this.props.searchKeyword) {
        newState = {
          searching: true,
          fullyExpanded: nextProps.expand,
          expanded: nextProps.expand
        };
      }

      if (nextProps.selectedValue != this.props.selectedValue) {
        var selectedState = this.state.selected;
        var value = this.props.root[this.props.conf.valueKey];
        if (!nextProps.selectedValue) selectedState = false;else if (typeof nextProps.selectedValue == "string" && value == nextProps.selectedValue) selectedState = true;else if (nextProps.selectedValue.indexOf(value) >= 0) selectedState = true;else selectedState = false;

        newState = _extends({}, newState, {
          selected: selectedState
        });
      }

      this.setState(newState, function () {
        _this2.__getShownChildren(nextProps);
      });
    }
  }, {
    key: "expandHandler",
    value: function expandHandler() {
      // leaf, i.e. no children
      if (!this.props.root.children || !this.props.root.children.length) return;

      var newState = {
        searching: false
      };

      if (this.state.expanded || this.state.fullyExpanded) newState = _extends({}, newState, {
        expanded: false,
        fullyExpanded: false
      });else newState = _extends({}, newState, {
        expanded: true,
        fullyExpanded: true
      });

      this.setState(newState, this.__getShownChildren);
    }
  }, {
    key: "shownChildren",
    value: function shownChildren() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      var root = props.root,
          conf = props.conf,
          label = root[conf.labelKey];

      if (!root.children) return null;

      if (this.state.fullyExpanded) return root.children;

      if (!this.state.searching && (!this.state.fullyExpanded || !this.state.expanded)) {
        return null;
      }

      // if in search mode
      if (!props.matchedPath) {
        return [];
      }

      var shownChildren = [];

      var p = props.path.split(_DslTreeSelect.PATH_DELIM);
      if (p[p.length - 1].indexOf(props.searchKeyword) >= 0) {
        shownChildren = props.root.children;
      } else {
        root.children.forEach(function (child) {
          var path = props.path + _DslTreeSelect.PATH_DELIM + child[conf.labelKey],
              childMatchedPath = props.matchedPath[props.depth + 1];

          if (!childMatchedPath) return;

          if (childMatchedPath.indexOf(path) >= 0) {
            shownChildren.push(child);
          }
        });
      }

      if (shownChildren.length) {
        var newState = {
          expanded: true
        };
        if (shownChildren.length == props.root.children.length) newState.fullyExpanded = true;
        this.setState(newState);
      } else {
        this.setState({
          expanded: false,
          fullyExpanded: false
        });
      }

      return shownChildren;
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(e) {
      var root = this.props.root,
          value = root[this.props.conf.valueKey];

      this.setState({ selected: e.target.checked });
      this.props.selectHandler(value, !e.target.checked);
    }
  }, {
    key: "showCheckBox",
    value: function showCheckBox() {
      if (this.props.root.children || this.props.conf.selectMode != "leaf") return null;

      return _react2.default.createElement("input", {
        type: "checkbox",
        checked: this.state.selected,
        onChange: this.handleSelect.bind(this)
      });
    }
  }, {
    key: "showExpandIcon",
    value: function showExpandIcon() {
      if (!this.props.root.children) return null;

      var conf = this.props.conf;
      if (this.state.expanded || this.state.fullyExpanded) return _react2.default.createElement("span", { className: conf.collapseIconClassNames });

      return _react2.default.createElement("span", { className: conf.expandIconClassNames });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var root = this.props.root,
          conf = this.props.conf,
          label = root[conf.labelKey],
          children = this.state.shownChildren;

      if (this.props.depth == 0 && this.props.matchedPath) {
        if (!this.props.matchedPath[0] || this.props.matchedPath[0].indexOf(label) == -1) return null;
      }

      var ulCls = (0, _classnames2.default)("dsl-ts-node", conf.ulClassNames);
      var liCls = (0, _classnames2.default)("dsl-ts-node-label", conf.liClassNames);

      return _react2.default.createElement(
        "ul",
        { className: ulCls },
        _react2.default.createElement(
          "li",
          { className: liCls },
          this.showCheckBox.call(this),
          _react2.default.createElement(
            "span",
            {
              className: "dsl-ts-node-label-span",
              onClick: this.expandHandler.bind(this)
            },
            this.showExpandIcon.call(this),
            label
          )
        ),
        children && children.length ? children.map(function (child, idx) {
          var defaultExpand = false;
          // console.log(this.state.searching, child.defaultExpand);
          if (_this3.state.searching && child.defaultExpand) {
            defaultExpand = true;
          }
          return _react2.default.createElement(DslTreeSelectNode, {
            key: _this3.props.depth + "-" + idx,
            root: child,
            conf: conf,
            depth: _this3.props.depth + 1,
            path: _this3.props.path + _DslTreeSelect.PATH_DELIM + child[conf.labelKey],
            expand: defaultExpand,
            matchedPath: _this3.props.matchedPath,
            searchKeyword: _this3.props.searchKeyword,
            searching: _this3.state.searching,
            selectedValue: _this3.props.selectedValue,

            selectHandler: _this3.props.selectHandler
          });
        }) : null
      );
    }
  }]);

  return DslTreeSelectNode;
}(_react2.default.Component);

DslTreeSelectNode.propTypes = {
  // unused
  // show node
  // default: true for root, false for other nodes
  show: _react2.default.PropTypes.bool,
  // show children
  // default: false
  expand: _react2.default.PropTypes.bool,
  // whether this node can be selected
  // if it can, a checkbox is displayed
  // default: false
  canSelect: _react2.default.PropTypes.bool,
  // if this node isn't leaf and can be selected,
  // whether selecting this node will cause all child nodes
  // being selected
  selectHandler: _react2.default.PropTypes.func,
  selectChildren: _react2.default.PropTypes.bool,
  // depth of the node,
  // useful for searching
  depth: _react2.default.PropTypes.number,
  // when searching, if a path is matched,
  // it will be broken into an array
  // if the node is in this path
  // then it should be shown
  matchedPath: _react2.default.PropTypes.object,

  isLeaf: _react2.default.PropTypes.bool,
  liClassNames: _react2.default.PropTypes.string,
  ulClassNames: _react2.default.PropTypes.string,
  label: _react2.default.PropTypes.string,
  selected: _react2.default.PropTypes.bool,
  expandIconClassNames: _react2.default.PropTypes.string,
  collapseIconClassNames: _react2.default.PropTypes.string
};

DslTreeSelectNode.defaultProps = {
  expand: false,
  depth: 0,
  canSelect: false,
  isLeaf: false,
  selected: false
};

exports.default = DslTreeSelectNode;