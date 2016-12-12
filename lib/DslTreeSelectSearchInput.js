import React from "react";

class DslTreeSelectSearchInput extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      value: ""
    };
    this.searchTimer = null;
  }

  render() {
    return (
      <input
      className={this.props.classNames}
      readOnly={this.props.readOnly}
      value={this.state.value}
      onChange={(e) => {
        this.setState({"value": e.target.value});
        if (this.searchTimer)
          clearTimeout(this.searchTimer);
        let val = e.target.value;
        this.searchTimer = setTimeout(() => {
          // console.debug("begin search");
          this.props.changeHandler(val);
        }, 500)
      }}>
      </input>
    )
  }
}

export default DslTreeSelectSearchInput;

