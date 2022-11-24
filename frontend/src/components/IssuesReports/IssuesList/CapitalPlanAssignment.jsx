import React, { Component } from "react";
import { MyButton } from "../../Common/Forms/formsMiscItems";
import { ButtonStyle } from "../../../style/basic/commonControls";
import { themeService } from "../../../theme/service/activeTheme.service";
import { languageService } from "../../../Language/language.service";
import { ButtonActionsTable } from "../../Common/Buttons";
import ThisTable from "../../Common/ThisTable";

class CapitalPlanAssignment extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        Header: languageService("Name"),
        accessor: (d) => {
          let val = d.title;
          if (!val) {
            val = "N/A";
          }
          return <React.Fragment>{val}</React.Fragment>;
        },
        id: "title",
      },
      {
        Header: languageService("Actions"),
        accessor: (d) => {
          return (
            <React.Fragment>
              <ButtonActionsTable
                handleClick={() => {
                  this.props.addIssueToCapitalPlan(d, this.props.issue);
                }}
                margin="0px 10px 0px 0px"
                buttonText={languageService("Select")}
              />
            </React.Fragment>
          );
        },
        id: "actions",
      },
    ];
  }
  render() {
    return (
      <div>
        <div style={{ float: "right" }}>
          <MyButton
            type="button"
            style={themeService(ButtonStyle.commonButton)}
            onClick={(e) => {
              this.props.handleWorkorderModel(true, this.props.issue, true);
            }}
          >
            {languageService("New capital plan")}
          </MyButton>
        </div>
        <div style={{ fontSize: "20px" }}>{languageService("Existing capital plan")}</div>
        <div>
          <ThisTable tableData={this.props.capitalPlans} tableColumns={this.columns} pageSize={"20"} pagination={true} />
        </div>
      </div>
    );
  }
}

export default CapitalPlanAssignment;
