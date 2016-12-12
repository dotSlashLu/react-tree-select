import React from "react";
import classNames from "classnames";

import SearchInput from "./DslTreeSelectSearchInput"
import Node from "./DslTreeSelectNode"


class DslTreeSelect extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      selected: [],
      matchedPath: null,
      showAllNodes: false,
      searching: false
    };

    // only longest paths are needed
    this.searchIndex = [];
  }

  generateNodes(root, depth, idx, path = "") {
    path += root[this.props.labelKey];
    if (root.children)
      path += "->";
    // if it's leaf node,
    // build search index
    else
      this.searchIndex.push(path);

    const loopChildren = (node) => {
      if (node.children)
        return node.children.map((child, idx2) => {
          return this.generateNodes(child, depth + 1, depth + "-" + idx2, path);
        });

      return null;
    };

    let matchedPaths = null;
    if (this.state.matchedPath)
      matchedPaths = this.state.matchedPath.map((path) => {
        return path[depth];
      });

    let nodeShowChildren = false,
        nodeSearching = this.state.searching;

    // TODO: redundant
    const clickHandler = () => {
      nodeShowChildren = !nodeShowChildren;
      nodeSearching = false;
      console.debug("clickHandler parent",
        "\nnodeShowChildren:", nodeShowChildren,
        "\nnodeSearching:", nodeSearching);
    }

    return (
      <Node
      label={root[this.props.labelKey]}
      isLeaf={root.children ? false : true}
      depth={depth}
      matchedPath={matchedPaths}
      showChildren={this.state.showAllNodes || nodeShowChildren}
      searching={nodeSearching}
      clickHandler={clickHandler}
      key={depth + "-" + idx}>
        {loopChildren(root)}
      </Node>
    )
  }

  searchChangeHandler(val) {
    // e.preventDefault();
    if (!val) {
      this.setState({
        matchedPath: null,
        showAllNodes: false,
        searching: false
      });
      return;
    }
    // console.debug(
    //   "searching for " + val,
    //   "index", this.searchIndex
    // );
    // loop through searchIndex and match
    let matched = [];
    this.searchIndex.forEach((path) => {
      // console.debug(
      //   "matching against", path,
      //   "result", path.match(val)
      // );
      if (!path.match(val)) return;

      let delimIdx = path.indexOf("->", path.lastIndexOf(val));
      let chain = path;
      if (delimIdx > 0)
        chain = path.substring(0, delimIdx);
      // let pattern = new RegExp("(" + val + ".*?)(->)?", "g");
      matched = [...matched, chain.split("->")];
    });
    // when searching, show all nodes
    this.setState({
      matchedPath: matched,
      showAllNodes: true,
      searching: true
    });
  }

  render() {
    this.searchIndex = [];
    return (
      <div>
        <SearchInput
        classNames={this.props.searchInputClassNames}
        readOnly={!this.props.search}
        changeHandler={this.searchChangeHandler.bind(this)}/>
        <div>
          {this.props.data.map((datum, idx) => {
            return this.generateNodes(datum, 0, idx);
          })}
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

