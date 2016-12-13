import React from "react";
import classNames from "classnames";

import SearchInput from "./DslTreeSelectSearchInput"
import Node from "./DslTreeSelectNode"


class DslTreeSelect extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      matchedPath: null,
      showAllNodes: false,
      searching: false
    };

    // only longest paths are needed
    this.searchIndex = [];

    this.selected = [];
  }

  componentWillMount() {
    if (this.props.value)
      this.selected = this.props.value;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value != this.selected)
      this.selected = nextProps.value;
  }

  searchChangeHandler(val) {
    if (!val) {
      this.setState({
        matchedPath: null,
        showAllNodes: false,
        searching: false
      });
      return;
    }
    console.debug(
      "searching for " + val,
      "index", this.searchIndex
    );
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

  // TODO: dummy, might be redundant
  nodeExpandHandler(locals) {

  }

  nodeSelectHandler(value, isDeselect = false) {
    if (isDeselect)
      this.selected.splice(this.selected.indexOf(value), 1);
    else
      this.selected.push(value);

    this.props.changeHandler(this.selected);
  }


  /*
  * @param Array ret
  * @param Object root
  * @return bool whether parent should be shown
  */
  generateNode(ret, root, depth, idx, path = "") {
    let nodeLabel = root[this.props.labelKey],
        nodeValue = root[this.props.valueKey],
        nodeSelected = false;

    path += nodeLabel;
    if (root.children)
      path += "->";
    // if it's leaf node,
    // build search index
    else
      this.searchIndex.push(path);

    let children = [];
    const getChildren = (node) => {
      let showParent = false;

      if (!node.children) {
        if (this.props.value &&
        this.props.value.indexOf(nodeValue) >= 0) {
          nodeSelected = true;
          showParent = true;
        }
        return showParent;
      }

      node.children.forEach((child, idx2) => {
        let show = this.generateNode(
          children,
          child,
          depth + 1,
          depth + "-" + idx2,
          path
        );

        if (show)
          showParent = true;

        if (this.props.value &&
            this.props.value.indexOf(nodeValue) >= 0) {
          showParent = true;
          nodeSelected = true;
        }
      });
      return showParent;
    };

    let matchedPaths = null;
    if (this.state.matchedPath)
      matchedPaths = this.state.matchedPath.map((path) => {
        return path[depth];
      });

    let nodeShowChildren = false,
        nodeSearching = this.state.searching;

    const isLeaf = () => {
      return root.children ? false : true
    }

    const canSelect = () => {
      if (this.props.selectMode == "leaf")
        if (isLeaf())
          return true;

      return false;
    }

    // TODO: might be redundant,
    // if not, refactor to this.nodeExpandHandler
    const clickHandler = () => {
      nodeShowChildren = !nodeShowChildren;
      nodeSearching = false;
      console.debug("clickHandler parent",
        "\nnodeShowChildren:", nodeShowChildren,
        "\nnodeSearching:", nodeSearching);
    }

    nodeShowChildren = getChildren(root);

    ret.push(
      <Node
      label={nodeLabel}
      value={nodeValue}
      isLeaf={isLeaf()}
      canSelect={canSelect()}
      selected={nodeSelected}
      depth={depth}
      matchedPath={matchedPaths}
      showChildren={this.state.showAllNodes || nodeShowChildren}
      searching={nodeSearching}
      clickHandler={clickHandler}
      key={depth + "-" + idx}
      selectHandler={this.nodeSelectHandler.bind(this)}>
        {children}
      </Node>
    )

    return nodeShowChildren;
  }

  render() {
    this.searchIndex = [];

    let children = [];
    this.props.data.forEach((datum, idx) => {
      this.generateNode(children, datum, 0, idx);
    })
    return (
      <div>
        <SearchInput
        classNames={this.props.searchInputClassNames}
        readOnly={!this.props.search}
        changeHandler={this.searchChangeHandler.bind(this)}/>
        <div>
          {children}
        </div>
      </div>
    )
  }
}

DslTreeSelect.propTypes = {
  // tree data
  data: React.PropTypes.array.isRequired,
  // selected nodes
  value: React.PropTypes.array,
  // default: "value"
  valueKey: React.PropTypes.string,
  // default: "name"
  labelKey: React.PropTypes.string,
  wrapperClassNames: React.PropTypes.string,

  // whether multiple selection is allowed
  // default: false
  multi: React.PropTypes.bool,

  // enable search function
  // default: true
  search: React.PropTypes.bool,

  searchInputClassNames: React.PropTypes.string,

  changeHandler: React.PropTypes.func,

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

