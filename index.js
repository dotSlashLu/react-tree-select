import React from "react";
import classNames from "classnames";

class DslTreeSelectSearchInput extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      value: "" 
    };
  }


  render() {
    return (
      <input
      className={this.props.classNames}
      readOnly={this.props.readOnly}
      value={this.state.value}
      onChange={this.props.changeHandler}>
      </input>
    )
  }
}


class DslTreeSelectNode extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      showChildren: false
    };
  }

  componentWillMount() {
    this.setState({show: this.props.show});
  }

  selectHandler() {

  }

  labelClickHandler(e) {
    e.preventDefault();
    console.log("click label");
    if (!this.props.isLeaf) {
      let showChildren = !this.state.showChildren;
      console.log(showChildren);
      this.setState({showChildren: showChildren});
    }
  }

  render() {
    console.log(
      "render node", this.props.label
    );
    const shownChildren = () => {
      // if not in search mode
      console.log(this.state.showChildren);
      if (!this.props.matchedPath)
        return this.state.showChildren ? this.props.children : null;
      // if in search mode
      // show matched children
      return React.Children.map(this.props.children, (child) => {
        if (child.props.label == this.props.matchedPath[1])
          return child;
        return null;
      });
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

    if (!this.isLeaf)
      return (
        <ul className={ulCls}>
          <li
          className={liCls}
          onClick={this.labelClickHandler.bind(this)}>
            {this.props.label}
          </li>
          {shownChildren()}
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
  canSelect: React.PropTypes.bool,
  // depth of the node,
  // useful for searching
  depth: React.PropTypes.number.isRequired,
  // when searching, if a path is matched,
  // it will be broken into an array
  // if the node is in this path
  // then it should be shown
  matchedPath: React.PropTypes.arrayOf(React.PropTypes.string),

  isLeaf: React.PropTypes.bool,
  liClassNames: React.PropTypes.string,
  ulClassNames: React.PropTypes.string,
  label: React.PropTypes.string
}


class DslTreeSelect extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      selected: [],
      matchedPath: []
    };

    // only longest paths are needed
    this.searchIndex = [];
  }

  generateNodes(root, depth, idx, path = "") {
    console.debug("gen node", root);
    path += root.label; 
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

    return (
      <DslTreeSelectNode
      label={root.value}
      isLeaf={root.children ? false : true}
      depth={depth}
      matchedPath={this.state.matchedPath}
      key={depth + "-" + idx}>
        {loopChildren(root)}
      </DslTreeSelectNode>
    )
  }

  searchChangeHandler(e) {
    e.preventDefault();
    let val = e.target.value;
    console.debug("searching for " + val);
    // loop through searchIndex and match
    this.searchIndex.forEach((path) => {
      if (!path.match(val)) return;
      let matched = [...this.state.matchedPath, path.split("->")];
      this.setState({matchedPath: matched});
    })
  }

  render() {
    return (
      <div>
        <DslTreeSelectSearchInput
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
