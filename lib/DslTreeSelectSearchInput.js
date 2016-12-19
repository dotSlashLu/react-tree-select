import React from "react";

import {PATH_DELIM} from "./DslTreeSelect";

class DslTreeSelectSearchInput extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      value: ""
    };
    this.searchTimer = null;
  }

  search(val) {
    // console.debug(
    //   "searching for " + val,
    //   "index", this.props.index
    // );

    if (!val || !this.props.index)
      return this.props.setMatchedPath(null);

    let matchedSet = new Set();

    // loop through searchIndex and match
    this.props.index.forEach((path) => {
      // console.debug(
      //   "matching against", path,
      //   "result", path.match(val)
      // );
      // TODO: escape regex special characters
      if (!path.match(new RegExp(val))) return;

      let delimIdx = path.indexOf(PATH_DELIM, path.lastIndexOf(val));
      let chain = path;
      if (delimIdx > 0)
        chain = path.substring(0, delimIdx);
      // let pattern = new RegExp("(" + val + ".*?)(->)?", "g");
      // matched = [...matched, chain.split(PATH_DELIM)];
      matchedSet.add(chain);
    });

    let matchedArr = [...matchedSet],
        ret = {};

    matchedArr.forEach((path) => {
      let arr = path.split(PATH_DELIM);
      arr.forEach((p, depth) => {
        // TODO: eliminate this very unlikely condition
        if (!ret[depth]) ret[depth] = [];
        ret[depth].push([...arr].splice(0, depth + 1).join(PATH_DELIM));
      })
    })

    this.props.setMatchedPath(ret);
  }

  changeHandler(e) {
    let val = e.target.value;
    this.setState({"value": val});

    if (this.searchTimer)
      clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      // console.debug("begin search");
      this.search(val);
    }, 500);
  }

  render() {
    return (
      <input
      className={this.props.classNames}
      readOnly={this.props.readOnly}
      value={this.state.value}
      onChange={this.changeHandler.bind(this)}>
      </input>
    )
  }
}

export default DslTreeSelectSearchInput;

