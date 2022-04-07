import React, { Component } from "react";
import "./Button.css";

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
    };
  }

  handleClick(e) {
    if (this.props.onClick && typeof this.props.onClick === "function") {
      this.props.onClick(e);
    }
  }

  render() {
    let { className } = this.props;
    if (!className) {
      className = "rs-btn";
    } else {
      className = "rs-btn " + className;
    }
    return (
      <button className={className} onClick={(e) => this.handleClick(e)}>
        {this.props.children}
      </button>
    );
  }
}

export default Button;