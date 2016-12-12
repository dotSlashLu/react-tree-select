import React from "react";
import classNames from "classnames";

class DslTreeSelectNode extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showChildren: false,
      searching: false
    };
    this.childrenShown = false;
  }

  componentWillMount() {
    // TODO: this repeats componentWillReceiveProps function
    if (this.props.matchedPath)
      this.setState({
        searching: true
      });

    this.setState({
      showChildren: this.props.showChildren,
      searching: this.props.searching
    });
  }

  componentWillReceiveProps(nextProps) {
    // console.debug("nextProps.showChildren", nextProps.showChildren);
    this.setState({
      showChildren: nextProps.showChildren,
      searching: nextProps.searching
    });
  }

  selectHandler() {

  }

  labelClickHandler(e) {
    e.preventDefault();
    this.props.clickHandler();
    if (this.props.isLeaf)
      return;

    let showChildren = true;
    // careful, if the state is true but children didn't match,
    // the representing state is actually false
    if (this.state.showChildren && !this.childrenShown)
      showChildren = true;
    else
      showChildren = !this.state.showChildren;
    this.setState({
      showChildren: showChildren,
      searching: false
    });
  }

  render() {
    // console.debug(
    //   "render node", this.props.label,
    //   "\nmatched path at the depth of this node(" +
    //     this.props.label + " " + this.props.depth +
    //   ")",
    //   this.props.matchedPath
    // );

    const shownChildren = () => {
      // if not in search mode
      // console.debug(
      //   "this node", this.props.label,
      //   "\nstate.showChildren", this.state.showChildren,
      //   "\nstate.searching", this.state.searching,
      //   "\nprops.showChildren", this.props.showChildren,
      //   "\nprops.matchedPath", this.props.matchedPath,
      //   "\nprops.children", this.props.children
      // );

      if (!this.state.showChildren)
        return null;

      if (!this.state.searching) {
        let children = React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, {
            showChildren: false,
            searching: false
          });
        });
        if (children.length)
          this.childrenShown = true;
        return this.state.showChildren ? children : null;
      }


      // if in search mode
      // show matched children
      let children = [];
      React.Children.map(this.props.children, (child) => {
        let matched = false;
        // console.debug(
        //   "matched", child.props.matchedPath,
        //   "this node", child.props.label,
        //   "result", this.props.matchedPath.indexOf(child.props.label)
        // );
        if (child.props.matchedPath.indexOf(child.props.label) >= 0)
          children.push(child);
        // return null;
      });
      if (children.length)
        this.childrenShown = true;
      return children;
    }

    let ulCls = classNames(
      "dsl-ts-node",
      this.props.ulClassNames,
      // {"hide": !this.state.show}
    );
    let liCls = classNames(
      "dsl-ts-node-label",
      this.props.liClassNames
    );

    // searching
    if (this.state.searching &&
      this.props.matchedPath.indexOf(this.props.label) >= 0) {
      return (
        <ul className={ulCls}>
          <li
          className={liCls}
          onClick={this.labelClickHandler.bind(this)}>
            {this.props.label}
          </li>
          {shownChildren()}
        </ul>
      );
    }

    if (!this.state.searching) {
      return (
        <ul className={ulCls}>
          <li
          className={liCls}
          onClick={this.labelClickHandler.bind(this)}>
            {this.props.label}
          </li>
          {shownChildren()}
        </ul>
      );
    }

    // searching but no match
    return null;
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
  canSelect: React.PropTypes.bool,
  // depth of the node,
  // useful for searching
  depth: React.PropTypes.number.isRequired,
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
  label: React.PropTypes.string
}

export default DslTreeSelectNode;

