import React from "react";

class DslTreeSelectNode extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      expanded: false,
      shownChildren: []
    };
  }

  expandHandler() {
    // leaf, e.g. no children
    if (!root.children || !root.children.length)
      return;

    this.setState({
      expanded: !this.state.expanded
    });
  }

  shownChildren() {
    let root = this.props.root,
        conf = this.props.conf,
        label = root[conf.labelKey];

    if (!root.children)
      return null;

    if (!this.props.matchedPath)
      if (this.state.expanded)
        return root.children;
      return null;
    // if in search mode
    let shownChildren = [];
    root.children.forEach((child) => {
      if (this.props.matchedPath.indexOf(label) >= 0)
        shownChildren.push(child);
    });
    return shownChildren;
  }

  render() {
    let root = this.props.root,
        conf = this.props.conf,
        label = root[conf.labelKey],
        children = this.shownChildren();

    return (
      <ul>
        <li onClick={this.expandHandler.bind(this)}>{label}</li>
        {
          children && children.length ? (
            <ul>
            {
              children.map((child) => {
                return (
                  <DslTreeSelectNode
                  root={child}
                  conf={this.props.conf}/>
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
  showChildren: React.PropTypes.bool,
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
  matchedPath: React.PropTypes.arrayOf(
    React.PropTypes.string
  ),

  isLeaf: React.PropTypes.bool,
  liClassNames: React.PropTypes.string,
  ulClassNames: React.PropTypes.string,
  label: React.PropTypes.string,
  selected: React.PropTypes.bool,
  expandIconClassNames: React.PropTypes.string,
  collapseIconClassNames: React.PropTypes.string
}

DslTreeSelectNode.defaultProps = {
  showChildren: false,
  depth: 0,
  canSelect: false,
  isLeaf: false,
  selected: false
}

export default DslTreeSelectNode;

