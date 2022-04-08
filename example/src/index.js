import React, { useState } from "react";
import ReactDOM from "react-dom";
import Modal, { Button } from "../../src";
import "./index.css";

const App = () => {
  const [modalVisible, updateModalVisible] = useState(false);
  const [modalVisible2, updateModalVisible2] = useState(false);
  const [modalVisible3, updateModalVisible3] = useState(false);
  const [modalVisible4, updateModalVisible4] = useState(false);
  const handleClick = (e) => {
    updateModalVisible(true);
  };
  const handleClick2 = (e) => {
    updateModalVisible2(true);
  };

  const handleClick3 = (e) => {
    updateModalVisible3(true);
  };

  const handleClick4 = (e) => {
    updateModalVisible4(true);
  };

  return (
    <div>
      <Button onClick={(e) => handleClick(e)}>Basic</Button>
      <Button className="margin-left-10" onClick={(e) => handleClick3(e)}>
        No-Close
      </Button>
      <Button className="margin-left-10" onClick={(e) => handleClick4(e)}>
        Footer
      </Button>
      <Button className={"btn-center"} onClick={(e) => handleClick2(e)}>
        No-Mask
      </Button>
      <Modal
        visible={modalVisible}
        title="Title"
        onCancel={(e) => updateModalVisible(false)}
      >
        <div>Basic</div>
      </Modal>

      <Modal
        visible={modalVisible2}
        title="Title"
        onCancel={(e) => updateModalVisible2(false)}
        mask={false}
      >
        <div>mask=&#123;false&#125;</div>
      </Modal>

      <Modal
        visible={modalVisible3}
        title="Title"
        onCancel={(e) => updateModalVisible3(false)}
        closable={false}
      >
        <div>closable=&#123;false&#125;</div>
      </Modal>

      <Modal
        visible={modalVisible4}
        title="Title"
        onCancel={(e) => updateModalVisible4(false)}
        footer={[
          <Button key="selfCancelBtn" onClick={(e) => updateModalVisible4(false)}>cancel</Button>,
        ]}
      >
        <div
          style={{
            background: "#acacac",
            padding: "0 10px",
            width: "fit-content",
            fontSize: "20px",
          }}
        >
          <span style={{ color: "#ffc600" }}>footer</span>
          <span style={{ color: "#f59803" }}>=</span>
          <span style={{ color: "#7abde6" }}>&#123;</span>
          <span style={{ color: "#fcd401" }}>[</span>
          <span style={{ color: "#d4e3f4" }}>&lt;</span>
          <span style={{ color: "#80ffbb" }}>Button</span>
          <span style={{ color: "#d4e3f4" }}>&gt;</span>
          <span style={{ color: "#f4f5f6" }}>cancel</span>
          <span style={{ color: "#d4e3f4" }}>&lt;</span>
          <span style={{ color: "#d4e3f4" }}>/</span>
          <span style={{ color: "#80ffbb" }}>Button</span>
          <span style={{ color: "#d4e3f4" }}>&gt;</span>
          <span style={{ color: "#fcd401" }}>]</span>
          <span style={{ color: "#7abde6" }}>&#125;</span>
        </div>
      </Modal>
    </div>
  );
};

const root = document.getElementById("root");

ReactDOM.render(<App />, root);
