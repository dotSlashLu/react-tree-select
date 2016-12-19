import React from "react";

import {PATH_DELIM} from "./DslTreeSelect";

class DslTreeSelectNode extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      label: "",
      expanded: false,
      searching: false,
      shownChildren: []
    };
  }

  componentWillMount() {
    this.setState({
      expanded: this.props.expand,
      searching: this.props.searching
    }, () => {
      let children = this.shownChildren();
      this.setState({shownChildren: children});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expand == this.state.expanded &&
        nextProps.searching == this.state.searching &&
        nextProps.matchedPath == this.props.matchedPath)
      return;

    this.setState({
      expanded: nextProps.expand,
      searching: nextProps.searching
    }, () => {
      let children = this.shownChildren();
      this.setState({shownChildren: children});
    });
  }

  expandHandler() {
    // leaf, i.e. no children
    if (!root.children || !root.children.length)
      return;

    this.setState({
      searching: false,
      expanded: !this.state.expanded
    }, () => {
      let children = this.shownChildren();
      this.setState({shownChildren: children});
    });
  }

  shownChildren() {
    let root = this.props.root,
        conf = this.props.conf,
        label = root[conf.labelKey];

    if (!root.children)
      return null;


    if (this.state.expanded)
      return root.children;

    if (!this.state.searching && !this.state.expanded)
      return null;

    // if in search mode
    if (!this.props.matchedPath)
      return [];

    let shownChildren = [];
    root.children.forEach((child) => {
      let path = this.props.path + PATH_DELIM + child[conf.labelKey],
          childMatchedPath = this.props.matchedPath[this.props.depth + 1];

      if (!childMatchedPath)
        return;

      if (childMatchedPath.indexOf(path) >= 0)
        shownChildren.push(child);
    });
    if (shownChildren.length)
      this.setState({expanded: true});

    return shownChildren;
  }

  render() {
    let root = this.props.root,
        conf = this.props.conf,
        label = root[conf.labelKey],
        children = this.state.shownChildren;

    if (this.props.depth == 0 &&
        this.props.matchedPath &&
        this.props.matchedPath[0].indexOf(label) == -1)
      return null;

    return (
      <ul>
        <li onClick={this.expandHandler.bind(this)}>{label}</li>
        {
          children && children.length ? (
            <ul>
            {
              children.map((child, idx) => {
                return (
                  <DslTreeSelectNode
                  key={this.props.depth + "-" + idx}
                  root={child}
                  conf={this.props.conf}
                  depth={this.props.depth + 1}
                  path={this.props.path + PATH_DELIM + child[conf.labelKey]}
                  matchedPath={this.props.matchedPath}
                  searching={this.state.searching} />
                )
              })
            }
            </ul>
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

