import React from "react";
import Node from "./DslTreeSelectNode";

class DslTreeSelect extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      conf: {
        labelKey: "name",
        valueKey: "value",
      },
      index: [],
      selected: []
    };
  }

  componentDidMount() {
    this.setConfig(this.props);
  }

  //// is it necessary to respond to conf change?
  // componentWillReceiveProps(nextProps) {
  //   this.setConfig(nextProps);
  // }

  setConfig(props) {
    console.debug("set config");
    let conf = {
      labelKey: props.labelKey,
      valueKey: props.valueKey
    };
    this.setState({
      conf: conf
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

  render() {
    return (
      <div>
      {
        this.props.data.map((datum, idx) => {
          return (
            <Node
            root={datum}
            conf={this.state.conf}

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

