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
      searchKeyword: null,
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

    // console.debug("generated indexes", indexes);
    this.setState({
      index: indexes
    });
  }

  setConfig(props) {
    let searchExpandAll = false;
    if (props.hasOwnProperty("searchExpandAll"))
      searchExpandAll = props.searchExpandAll;
    else if(props.selectMode == "leaf")
      searchExpandAll = true;

    let conf = {
      labelKey: props.labelKey,
      valueKey: props.valueKey,
      selectMode: props.selectMode,
      // immature, now all siblings will be expanded
      // searchExpandAll: searchExpandAll,
      searchExpandAll: false,
      multi: props.multi,
      expandIconClassNames: props.expandIconClassNames,
      collapseIconClassNames: props.collapseIconClassNames
    };
    this.setState({
      conf: conf
    });
  }

  setMatchedPath(keyword, path) {
    console.debug("setting matchedPath", path);
    if (!keyword)
      return this.setState({
        searchKeyword: null,
        matchedPath: null,
        // searching: false
      });

    this.setState({
      matchedPath: path,
      searchKeyword: keyword,
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

    console.debug("selected:", selected);
    this.setState({
      selected: selected
    });
    return this.props.changeHandler(selected);
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
      <div className="dsl-ts">
        <Input
        className={this.props.searchInputClassNames}
        setMatchedPath={this.setMatchedPath.bind(this)}
        searchTriggerTimeout={this.props.searchTriggerTimeout}
        placeholder={this.props.searchInputPlaceholder}
        index={this.state.index} />

        <div className="dsl-ts-tree">
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
                searchKeyword={this.state.searchKeyword}
                searching={this.state.searching}
                expand={false}
                selectedValue={this.state.selected}

                selectHandler={this.selectHandler.bind(this)}/>
              )
            })
          }
        </div>
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
  searchTriggerTimeout: React.PropTypes.number,
  // expand a matched node to leaf,
  // default is true if selectMode is "leaf", otherwise false
  searchExpandAll: React.PropTypes.bool,

  searchInputClassNames: React.PropTypes.string,

  changeHandler: React.PropTypes.func,

  // which level can be selected
  // default: "leaf"
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
  searchTriggerTimeout: 500,
  expandIconClassNames: "glyphicon glyphicon-plus",
  collapseIconClassNames: "glyphicon glyphicon-minus"
}

export default DslTreeSelect;
export {PATH_DELIM};

