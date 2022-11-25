import React, { Component } from "react";

export const LocationPrefixListHeader = (props) => {
  return (
    <div className="location-prefix-list-header">
      <h5>Locations</h5>
    </div>
  );
};
export const LocationPrefixHeader = (props) => {
  return (
    <div className="location-prefix-header">
      <h5>{props.value ? props.value : "No Selected Location"}</h5>
    </div>
  );
};
