import React from "react";
//import ReactDOM from 'react-dom';
import { shallow } from "enzyme";
import App from "./App";

describe("App component", () => {
  it("renders without crashing", () => {
    shallow(<App />);
  });
});
