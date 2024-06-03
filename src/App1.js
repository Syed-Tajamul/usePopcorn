import React, { useState } from "react";
export default function App() {
  const [color, setColor] = useState("white");
  const buttoncolor = {
    backgroundColor: "#fff",
  };
  const [hide, setHide] = useState(false);
  const [password, setpassword] = useState();
  function handleClick() {
    setHide((prev) => !prev);
  }
  function handleChange(e) {
    setpassword(e.target.value);
  }
  const hiddenpassword = "********";
  function handleColor() {
    setColor("black");
  }
  return (
    <div style={{color : }}>
      <span>Password</span>
      <input
        style={{ fontSize: "15px" }}
        onChange={handleChange}
        value={hide ? hiddenpassword : password}
        type="text"
      />
      <button onClick={handleClick} style={{ fontSize: "20PX" }}>
        {hide ? "show" : "hide"}
      </button>
      <button style={buttoncolor} onClick={handleColor}>
        Turn on Bright
      </button>
    </div>
  );
}
