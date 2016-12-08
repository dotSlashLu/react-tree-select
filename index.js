import React from "react";
import classNames from "classnames";

class DslTreeSelectSearchInput extends React.Component {
  render() {
    return (
      <input
      className={this.props.classNames}
      readOnly={this.props.readOnly}>
      </input>
    )
  }
}


class DslTreeSelectNode extends React.Component {
  constructor(...args) {
    super(...args);
  }

  labelClickHandler(e) {
    e.preventDefault();

    // show all children?
  }

  render() {
    let ulCls = classNames(
      "dsl-ts-node",
      this.props.ulClassNames,
      {"hide": !this.props.show}
    );
    let liCls = classNames(
      "dsl-ts-node-label",
      this.props.liClassNames
    );

    if (!this.isLeaf)
      return (
        <ul className={ulCls}>
          <li 
          className={liCls}
          onClick={this.labelClickHandler.bind(this)}>
            {this.props.label}
          </li>
          {this.props.children}
        </ul>
      )

    return (
      <li className={liCls}>
        {this.props.label}
      </li>
    )
  }
}

DslTreeSelectNode.propTypes = {
  // show node
  // default: true for root, false for other nodes
  show: React.PropTypes.bool,
  // show children
  // default: false
  showChildren: React.PropTypes.bool,
  // wether this node can be selected
  // if it can, a checkbox is displayed
  // default: true
  canSelect: React.PropTypes.bool 
}


class DslTreeSelect extends React.Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    return (
      <div>
        <DslTreeSelectSearchInput
          classNames={this.props.searchInputClassNames}
          readOnly={!this.props.search}
        />
        <div>
        </div>
      </div>
    )
  }
}

DslTreeSelect.propTypes = {
  // tree data
  data: React.PropTypes.array.isRequired,
  // default: "value"
  valueKey: React.PropTypes.string,
  // default: "name"
  labelKey: React.PropTypes.string,

  // wether multiple selection is allowed
  // default: false
  multi: React.PropTypes.bool,

  // enable search function
  // default: true
  search: React.PropTypes.bool,

  searchInputClassNames: React.PropTypes.string,

  // which level can be selected
  // default: "node"
  selectMode: (props, propName, componentName) => {
    let p = props[propName],
        opts = [
          "node", // all nodes can be selected, this is the default value

          "leaf", // only selecting on leaf nodes is allowed

          "deep", // selecting a non-leaf node will cause all it's child nodes
                  // be selected, implies multi=true
        ];

    // n-only mode, only nodes of level n can be selected
    if (p && opts.indexOf(p) == -1 && !p.match(/\d+\-only/))
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. `' + componentName + '` should be one of' +
        'node/leaf/deep/{n}-only, where n is a number.'
      );
  }
}

DslTreeSelect.defaultProps = {
  valueKey: "value",
  labelKey: "name",
  multi: false,
  search: false,
  selectMode: "leaf"
}

export default DslTreeSelect;

