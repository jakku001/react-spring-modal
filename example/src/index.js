import React, { useState } from "react";
import ReactDOM from "react-dom";
import Modal, { Button } from "../../src";

const App = () => {
  const [modalVisible, updateModalVisible] = useState(false);
  const handleClick = (e) => {
    updateModalVisible(true);
  };
  return (
    <div>
      <Button onClick={(e) => handleClick(e)}>测试</Button>
      <Modal
        visible={modalVisible}
        title="测试"
        onCancel={(e) => updateModalVisible(false)}
        maskClosable={false}
      >
        <div>hello</div>
      </Modal>
    </div>
  );
};

const root = document.getElementById("root");

ReactDOM.render(<App />, root);
