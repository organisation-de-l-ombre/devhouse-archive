// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { shallow } from "enzyme";
import React from "react";
import Root from "Root";

/*
 * Test if the component rendered poperly compared to the stored snapshot.
 */
test("Should render correctly", () => {
  const wrapper = shallow(<Root />);
});
