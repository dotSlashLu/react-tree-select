import React from "react";
import classNames from "classnames";

import {PATH_DELIM} from "./DslTreeSelect";

class DslTreeSelectNode extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      label: "",
      // might not be fully expanded,
      // e.g. when searching, only matched children are shown
      expanded: false,
      fullyExpanded: false,
      searching: false,
      selected: false,
      shownChildren: []
    };
  }

  __getShownChildren(props) {
    let children = this.shownChildren(props);
    this.setState({shownChildren: children});
  }

  componentWillMount() {
    const value = this.props.root[this.props.conf.valueKey];
    let newState = {
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

  componentWillReceiveProps(nextProps) {
    let newState = {};

    if (nextProps.searchKeyword != this.props.searchKeyword) {
      newState = {
        searching: true,
        fullyExpanded: nextProps.expand,
        expanded: nextProps.expand
      };
    }

    if (nextProps.selectedValue != this.props.selectedValue) {
      let selectedState = this.state.selected;
      let value = this.props.root[this.props.conf.valueKey];
      if (!nextProps.selectedValue)
        selectedState = false;
      else if (typeof nextProps.selectedValue == "string" &&
          value == nextProps.selectedValue)
        selectedState = true;
      else if (nextProps.selectedValue.indexOf(value) >= 0)
        selectedState = true;
      else
        selectedState = false;

      newState = {
        ...newState,
        selected: selectedState
      };
    }

    this.setState(newState, () => {this.__getShownChildren(nextProps)});
  }

  expandHandler() {
    // leaf, i.e. no children
    if (!this.props.root.children || !this.props.root.children.length)
      return;

    let newState = {
      searching: false
    };

    if (this.state.expanded || this.state.fullyExpanded)
      newState = {
        ...newState,
        expanded: false,
        fullyExpanded: false
      };

    else
      newState = {
        ...newState,
        expanded: true,
        fullyExpanded: true
      };

    this.setState(newState, this.__getShownChildren);
  }

  shownChildren(props = this.props) {
    let root = props.root,
        conf = props.conf,
        label = root[conf.labelKey];


    if (!root.children)
      return null;

    if (this.state.fullyExpanded)
      return root.children;

    if (!this.state.searching &&
        (!this.state.fullyExpanded || !this.state.expanded)) {
      return null;
    }

    // if in search mode
    if (!props.matchedPath) {
      return [];
    }


    let shownChildren = [];

    let p = props.path.split(PATH_DELIM);
    if (p[p.length - 1].indexOf(props.searchKeyword) >= 0) {
      shownChildren = props.root.children;
    }

    else {
      root.children.forEach((child) => {
        let path = props.path + PATH_DELIM + child[conf.labelKey],
            childMatchedPath = props.matchedPath[props.depth + 1];

        if (!childMatchedPath)
          return;

        if (childMatchedPath.indexOf(path) >= 0) {
          shownChildren.push(child);
        }
      });
    }

    if (shownChildren.length) {
      let newState = {
        expanded: true
      };
      if (shownChildren.length == props.root.children.length)
        newState.fullyExpanded = true;
      this.setState(newState);
    }
    else {
      this.setState({
        expanded: false,
        fullyExpanded: false
      });
    }


    return shownChildren;
  }

  handleSelect(e) {
    let root = this.props.root,
        value = root[this.props.conf.valueKey];

    this.setState({selected: e.target.checked});
    this.props.selectHandler(value, !e.target.checked);
  }

  showCheckBox() {
    if (this.props.root.children ||
        this.props.conf.selectMode != "leaf")
      return null;

    return <input
              type="checkbox"
              checked={this.state.selected}
              onChange={this.handleSelect.bind(this)}
           />
  }

  showExpandIcon() {
    if (!this.props.root.children)
      return null;

    let conf = this.props.conf;
    if (this.state.expanded || this.state.fullyExpanded)
      return <span className={conf.collapseIconClassNames}></span>;

    return <span className={conf.expandIconClassNames}></span>;
  }

  render() {
    let root = this.props.root,
        conf = this.props.conf,
        label = root[conf.labelKey],
        children = this.state.shownChildren;

    if (this.props.depth == 0 && this.props.matchedPath) {
      if (!this.props.matchedPath[0] ||
          this.props.matchedPath[0].indexOf(label) == -1)
        return null;
    }

    let ulCls = classNames(
      "dsl-ts-node",
      conf.ulClassNames,
    );
    let liCls = classNames(
      "dsl-ts-node-label",
      conf.liClassNames
    );

    return (
      <ul className={ulCls}>
        <li className={liCls}>
          {this.showCheckBox.call(this)}

          <span
            className="dsl-ts-node-label-span"
            onClick={this.expandHandler.bind(this)}
          >
            {this.showExpandIcon.call(this)}
            {label}
          </span>

        </li>

        {
          children && children.length ? (
            children.map((child, idx) => {
              let defaultExpand = false;
              // console.log(this.state.searching, child.defaultExpand);
              if (this.state.searching && child.defaultExpand) {
                defaultExpand = true;
              }
              return (
                <DslTreeSelectNode
                  key={this.props.depth + "-" + idx}
                  root={child}
                  conf={conf}
                  depth={this.props.depth + 1}
                  path={this.props.path + PATH_DELIM + child[conf.labelKey]}
                  expand={defaultExpand}
                  matchedPath={this.props.matchedPath}
                  searchKeyword={this.props.searchKeyword}
                  searching={this.state.searching}
                  selectedValue={this.props.selectedValue}

                  selectHandler={this.props.selectHandler}
                />
              )
            })
          ) : null
        }
      </ul>
    )
  }
}

DslTreeSelectNode.propTypes = {
  // unused
  // show node
  // default: true for root, false for other nodes
  show: React.PropTypes.bool,
  // show children
  // default: false
  expand: React.PropTypes.bool,
  // whether this node can be selected
  // if it can, a checkbox is displayed
  // default: false
  canSelect: React.PropTypes.bool,
  // if this node isn't leaf and can be selected,
  // whether selecting this node will cause all child nodes
  // being selected
  selectHandler: React.PropTypes.func,
  selectChildren: React.PropTypes.bool,
  // depth of the node,
  // useful for searching
  depth: React.PropTypes.number,
  // when searching, if a path is matched,
  // it will be broken into an array
  // if the node is in this path
  // then it should be shown
  matchedPath: React.PropTypes.object,

  isLeaf: React.PropTypes.bool,
  liClassNames: React.PropTypes.string,
  ulClassNames: React.PropTypes.string,
  label: React.PropTypes.string,
  selected: React.PropTypes.bool,
  expandIconClassNames: React.PropTypes.string,
  collapseIconClassNames: React.PropTypes.string
}

DslTreeSelectNode.defaultProps = {
  expand: false,
  depth: 0,
  canSelect: false,
  isLeaf: false,
  selected: false
}

export default DslTreeSelectNode;

