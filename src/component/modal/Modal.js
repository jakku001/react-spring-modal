import React, { Component } from "react";
import { createPortal } from "react-dom";
import { Spring, animated } from "react-spring";
import "./Modal.css";
import Button from "../button";

class Modal extends Component {
  constructor(props) {
    super(props);
    let modalBox = window.document.createElement("div");
    this.state = {
      modalBox,
      mousePosition: { x: 0, y: 0 },
      modalWrapStyle: {},
      lambda: 0.8,
      modalAnimationDuration: 200,
      isOpen: false,
    };
    window.document.body.appendChild(this.state.modalBox);
  }

  componentWillUnmount() {
    const { destroyOnClose } = this.props;
    window.document.body.removeChild(this.state.modalBox);
  }

  componentDidMount() {
    window.document.documentElement.addEventListener("click", (e) =>
      this.handleClick(e)
    );
  }

  handleOk() {
    if (this.props.onOk && typeof this.props.onOk === "function") {
      this.props.onOk();
    } else {
      this.handleCancel();
    }
  }

  handleCancel() {
    if (this.props.onCancel && typeof this.props.onCancel === "function") {
      this.props.onCancel();
    }
  }

  handleMaskClick(e) {
    const { maskClosable } = this.props;
    if (maskClosable !== false && e.currentTarget === e.target) {
      this.handleCancel();
    }
  }

  handleClick(e) {
    // modal刚打开时，要设置变换原点，但是要注意打开后不再设置变换原点
    if (this.props.visible && !this.state.isOpen) {
      let x1 = window.innerWidth / 2;
      let y1 = 260;

      let targetRect = e.target.getBoundingClientRect();

      let x2 = targetRect.x + targetRect.width / 2;
      let y2 = targetRect.y + targetRect.height / 2;

      let dx = (x2 - x1) / this.state.lambda + 260;

      let dy = (y2 - y1) / this.state.lambda + 160;
      this.setState({
        mousePosition: {
          x: dx,
          y: dy,
        },
      });
    }
  }

  handleModalAnimationStart() {
    if (this.props.visible) {
      // 动画开始，并且可视，则是播放启动动画，重置掉wrap display
      this.setState({
        isOpen: true,
      });
    } else {
      // 动画开始，但不可见，则是播放结束动画，需要在动画结束后把wrap display=none
      setTimeout(() => {
        this.setState({
          isOpen: false,
        });
      }, this.state.modalAnimationDuration * this.state.lambda);
    }
  }

  render() {
    const { closable, visible, title, children, footer, mask } = this.props;
    const { mousePosition, isOpen, modalAnimationDuration } = this.state;
    let transformOrigin = mousePosition.x + "px " + mousePosition.y + "px";
    let _mask = "";
    let _closable = closable != false;
    let _title = !title ? (
      ""
    ) : (
      <div className="rs-modal-header">
        <div className="rs-modal-title">{title}</div>
      </div>
    );
    let modalWrapStyle = {};
    let _modalSpringFrom = {};
    let _modalSpringTo = {};
    if (!visible) {
      //
      if (!isOpen) {
        modalWrapStyle.display = "none";
      }
      _modalSpringFrom = {
        width: "520px",
        transformOrigin,
        transform: "scale(1)",
        opacity: "1",
      };

      _modalSpringTo = {
        width: "520px",
        transformOrigin,
        transform: "scale(0.2)",
        opacity: "0.2",
      };
    } else {
      _mask = mask !== false ? <div className="rs-modal-mask"></div> : "";
      _modalSpringFrom = {
        width: "520px",
        transformOrigin,
        transform: "scale(0.2)",
        opacity: "0.2",
      };

      _modalSpringTo = {
        width: "520px",
        transformOrigin,
        transform: "scale(1)",
        opacity: "1",
      };
    }

    let _modalSpringConfig = {
      duration: modalAnimationDuration,
    };

    let _footer = footer;
    if (!footer || (footer && footer.length < 1)) {
      _footer = [
        <Button key="cancel" onClick={(e) => this.handleOk()}>
          取消
        </Button>,
        <Button key="submit" onClick={(e) => this.handleCancel()}>
          确定
        </Button>,
      ];
    }

    let closeBtn = _closable ? (
      <button
        type="button"
        aria-label="Close"
        className="rs-modal-close"
        onClick={(e) => this.handleCancel()}
      >
        <span className="rs-modal-close-x">
          <span
            role="img"
            aria-label="close"
            className="rs-anticon rs-anticon-close rs-modal-close-icon"
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="close"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
            </svg>
          </span>
        </span>
      </button>
    ) : (
      ""
    );
    return createPortal(
      <div className="rs-modal-root">
        {_mask}
        <div
          className="rs-modal-wrap"
          style={modalWrapStyle}
          onClick={(e) => this.handleMaskClick(e)}
        >
          <Spring
            config={_modalSpringConfig}
            from={_modalSpringFrom}
            to={_modalSpringTo}
            onStart={() => this.handleModalAnimationStart()}
          >
            {(styles) => (
              <animated.div className="rs-modal" style={styles}>
                <div className="rs-modal-content">
                  {closeBtn}
                  {_title}
                  <div className="rs-modal-body">{children}</div>
                  <div className="rs-modal-footer">{_footer}</div>
                </div>
              </animated.div>
            )}
          </Spring>
        </div>
      </div>,
      this.state.modalBox
    );
  }
}

export default Modal;
