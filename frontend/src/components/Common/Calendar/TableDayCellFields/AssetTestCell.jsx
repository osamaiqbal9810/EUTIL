import React from "react";
import { getStatusColor } from "utils/statusColors";
import SvgIcon from "react-icons-kit";
import { search } from "react-icons-kit/icomoon/search";
import { themeService } from "theme/service/activeTheme.service";
import { tableCellStyle } from "../style/TableDayCell";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { retroColors } from "../../../../style/basic/basicColors";
export const AssetTestCell = (props) => {
  let executed = props.obj.status ? false : true;
  let completed = props.obj.completed;
  let colorStatus = executed ? "Finished" : props.obj.status;
  let bgClr = getStatusColor(colorStatus);
  return (
    <div id={props.obj._id} style={{ cursor: "pointer" }}>
      <div
        onClick={(e) => {
          props.handleViewItem && props.handleViewItem(props.obj);
        }}
      >
        <div className="detail-title" style={themeService(tableCellStyle.detailTitle(bgClr))}>
          <div className="detail-icon" style={themeService(tableCellStyle.detailIcon)}>
            <SvgIcon
              size={13}
              icon={search}
              style={{
                marginRight: "5px",
                marginLeft: "5px",
                verticalAlign: "middle",
                zIndex: "10",
                position: "relative",
              }}
            />
          </div>
          <div className={"detail-text"} style={themeService(tableCellStyle.detailText)}>
            {completed && (
              <span style={{ color: retroColors.first }}>
                <SvgIcon
                  size={13}
                  icon={checkmark}
                  style={{
                    marginRight: "5px",
                    marginLeft: "5px",
                    verticalAlign: "right",
                    zIndex: "10",
                    position: "relative",
                  }}
                />
              </span>
            )}
            {props.obj.title}
          </div>
        </div>
      </div>
    </div>
  );
};
