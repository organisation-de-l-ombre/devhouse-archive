import { shallow } from "enzyme";
import React from "react";
import toJson from "enzyme-to-json";
import Root from "Root";

/*
 * Test if the component rendered poperly compared to the stored snapshot.
 */
test("Should render correctly", () => {
  const wrapper = shallow(<Root />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
