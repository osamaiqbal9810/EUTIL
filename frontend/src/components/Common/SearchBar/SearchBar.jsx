import React from "react";
import Icon from "react-icons-kit";
import { ic_search } from "react-icons-kit/md/ic_search";
export const Searchbar = (props) => {
  return (
    <div style={{ display: "inline-block" }}>
      <Icon icon={ic_search} />
      <input
        name="searchBar"
        onChange={(e) => {
          props.onChange;
        }}
      />
    </div>
  );
};
