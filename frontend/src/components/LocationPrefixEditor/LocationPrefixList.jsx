import React from "react";
export const LocationPrefixList = (props) => {
  let detailList =
    props.pLocations &&
    props.pLocations.map((pLocs) => {
      let locationAssets = props.locationGroups[pLocs._id];
      let locs = null;
      if (pLocs.expanded) {
        locs =
          locationAssets &&
          locationAssets.map((loc) => {
            return <AppFormRow handleSelectedLocation={props.handleSelectedLocation} value={loc.unitId} item={loc} key={loc._id} />;
          });
      }

      return (
        <React.Fragment key={pLocs._id}>
          <div className="loc-parents">
            <AppFormRow
              handleSelectedLocation={props.handleSelectpLocation}
              head={true}
              value={pLocs.unitId}
              item={pLocs}
              key={pLocs._id}
            />

            <div className="loc-children">{locs}</div>
          </div>
        </React.Fragment>
      );
    });

  return <div className="location-prefix-list location-button"> {detailList}</div>;
};
const AppFormRow = (props) => {
  return (
    <div
      className={props.head ? "loc-parent" : "loc-child"}
      onClick={(e) => {
        props.handleSelectedLocation(props.item);
      }}
    >
      {props.value}
    </div>
  );
};
