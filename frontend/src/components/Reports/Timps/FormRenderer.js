import React, { Component } from "react";

import classnames from 'classnames';
import './formRenderer.css';
import { FormHeader } from "./Components/FormHeader";
import { TabSection } from "./Components/TabSection";
import { Nav, NavItem, NavLink, TabPane, Row, TabContent } from 'reactstrap';
class FormRenderer extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    displayForms() {
        let cardForm;
        let { list, selectedAsset, correspondingWp } = this.props;
        let { appLookUps } = this.props;
        if (correspondingWp && selectedAsset) {
                if (correspondingWp.tasks) {
                    correspondingWp.tasks.forEach((task) => {
                        if (task && task.units) {
                            let unit = task.units.find(({ id }) => id == selectedAsset._id);
                            if (unit && unit.testForm.length > 0) {
                                unit.testForm.forEach((form) => {
                                    console.log(form);
                                    if (form &&  unit.appForms.length > 0) {
                                        let formJson = appLookUps.find(({ code }) => code == form.testCode);
                                        let jsonFormObj = formJson ? formJson.opt1 : null;
                                        cardForm = this.renderForm(jsonFormObj, form, correspondingWp, unit.appForms[0]);

                                    }
                                })

                            }
                        }

                    })
                }

        }
        return cardForm;
    }
    renderForm(formObj, form, jPlan, appForm) {
        // console.log(formObj);
        // console.log(form);
        // console.log(jPlan);
        if (formObj && form && jPlan) {
            return (
                <div>
                    <FormHeader form={form} jPlan={jPlan} />
                    {formObj.map((tab, index) => {
                        if (tab) {
                            return (
                                <div>
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: this.state.activeTab === index })}
                                                onClick={() => { this.toggle(index); }}
                                            >
                                                {tab.tabName ? tab.tabName : 'Inspection Details'}
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId={index} >
                                            <Row>
                                                {tab.sections.map((tabSection) => {
                                                    if (tabSection) {
                                                        return (
                                                            <TabSection tabSection={tabSection} appFormValues = {appForm} />
                                                        )
                                                    }
                                                })
                                                }
                                            </Row>
                                        </TabPane>
                                    </TabContent>
                                </div>
                            )
                        }
                    })
                    }
                </div>
            )

        }
    }
    render() {
        return (
            <div class="card" style={{ margin: '20px' }}>{this.displayForms()}</div>
        );
    }
}

export default FormRenderer;