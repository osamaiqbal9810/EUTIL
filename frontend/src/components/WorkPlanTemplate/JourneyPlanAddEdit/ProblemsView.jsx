import React from "react";

export default function ProblemsView(props) {
  return (
    <React.Fragment>
      <ul className="problem-msg">
        {props.problems.map((lp, index) => {
          return <li key={index}> {lp}</li>;
        })}
      </ul>
    </React.Fragment>
  );
}
