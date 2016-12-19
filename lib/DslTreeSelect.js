import React from "react";
import Input from "./DslTreeSelectSearchInput";
import Node from "./DslTreeSelectNode";

const PATH_DELIM = "=>";

class DslTreeSelect extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      conf: {
        labelKey: "name",
        valueKey: "value",
      },
      searching: false,
      index: [],
      selected: []
    };
  }

  componentDidMount() {
    this.setConfig(this.props);
    this.buildIndex(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    //// is it necessary to respond to conf change?
    this.setConfig(nextProps);
    if (nextProps.data != this.props.data)
      this.buildIndex(nextProps.data);
  }

  buildIndex(data) {
    if (!data || !data.length)
      return [];

    let indexes = [];

    const buildPath = (path, node) => {
      let label = node[this.state.conf["labelKey"]];

      if (!path)
        path = label;
      else
        path += PATH_DELIM + label;

      if (!node.children)
        return indexes.push(path);

      node.children.forEach((child) => {
        buildPath(path, child);
      });
    }

    data.forEach((datum) => {
      buildPath("", datum);
    });

    console.debug("generated indexes", indexes);
    this.setState({
      index: indexes
    });
  }

  setConfig(props) {
    let conf = {
      labelKey: props.labelKey,
      valueKey: props.valueKey
    };
    this.setState({
      conf: conf
    });
  }

  setMatchedPath(path) {
    console.debug("setting matchedPath", path);
    this.setState({
      matchedPath: path,
      searching: true
    });
  }

  selectHandler(value, deselect = false) {
    // only one selection allowed
    let selected = [];

    if (!this.props.multi) {
      if (deselect)
        selected = null;
      else
        selected = value;
    }

    else {
      let state = this.state.selected;
      if (deselect)
        selected = [...state].splice(state.indexOf(value), 1);
      else
        selected = [...state, value];
    }

    this.setState({
      selected: selected
    });
  }

  addIndex(idx) {
    this.setState({
      index: [...this.state.index, idx]
    });
  }

  setSearching(state) {
    this.setState({
      searching: state
    });
  }

  render() {
    return (
      <div>
      <Input
      setMatchedPath={this.setMatchedPath.bind(this)}
      index={this.state.index} />
      {
        this.props.data.map((datum, idx) => {
          return (
            <Node
            key={"0-" + idx}
            root={datum}
            conf={this.state.conf}
            depth={0}
            path={datum[this.state.conf["labelKey"]]}
            matchedPath={this.state.matchedPath}
            searching={this.state.searching}

            addIndex={this.addIndex.bind(this)}
            selectHandler={this.selectHandler.bind(this)}/>
          )
        })
      }
      </div>
    )
  }
}


DslTreeSelect.propTypes = {
  // tree data
  data: React.PropTypes.array.isRequired,
  // selected nodes
  value: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ]),
  // default: "value"
  valueKey: React.PropTypes.string,
  // default: "name"
  labelKey: React.PropTypes.string,
  wrapperClassNames: React.PropTypes.string,
  treeClassNames: React.PropTypes.string,
  expandIconClassNames: React.PropTypes.string,

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
  selectMode: "leaf",
  expandIconClassNames: "glyphicon glyphicon-plus",
  collapseIconClassNames: "glyphicon glyphicon-minus"
}

export default DslTreeSelect;
export {PATH_DELIM};

