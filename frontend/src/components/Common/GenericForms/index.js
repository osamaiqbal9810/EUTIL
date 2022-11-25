import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import { ModalStyles } from "../styles";
import { ButtonStyle, CommonModalStyle } from "../../../style/basic/commonControls";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { languageService } from "../../../Language/language.service";
import FormsWrapper from "./FormsWrapper";
import FormLayout1 from "./FormLayout1";
import FormLayout2 from "./FormLayout2";
import _ from 'lodash';

const MyButton = props => (
    <button className="setPasswordButton" {...props}>
        {props.children}
    </button>
);
const MyButtonDisabled = props => (
    <button className="disabledButton" disabled {...props}>
        {props.children}
    </button>
);


class GenericFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            appForms: [],
            formIndex: 0,
            selectedForm: null,
            formsStack: []
        };

        this.renderPrevNextButton = this.renderPrevNextButton.bind(this);
        this.processAppForms = this.processAppForms.bind(this);
        this.handleUpdateFormsState = this.handleUpdateFormsState.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.modal !== prevProps.modal && this.props.modal) {
            this.processAppForms(this.props.task.appForms);
        }
    }

    handlePrev() {
        this.setState(({ formIndex }) => ({ formIndex: formIndex - 1 }));
    }

    handleNext() {
        this.setState(({ formIndex }) => ({ formIndex: formIndex + 1 }));
    }

    handleBack() {
        let { formsStack } = this.state;
        if (formsStack && !!formsStack.length) {
            let { appForms, formIndex } = formsStack.pop();
            this.setState({ appForms, formIndex });
        }
    }

    processAppForms(appForms) {
        this.setState({ appForms });
    }

    handleUpdateFormsState(state) {
        this.setState(state)
    };

    renderLayout(form) {
        // switch (form.id) {
        //     case 'form1':
        //         return <FormLayout1 form={form}/>;
        //     case 'form2':
        //         return <FormLayout2 form={form}/>;
        //     default:
        return <FormLayout1 form={form} {...this.state} handleUpdateFormsState={this.handleUpdateFormsState} />;
        // }
    }

    renderPrevNextButton(button) {
        if ((button === 'prev' && this.state.formIndex <= 0) || (button === 'next' && this.state.formIndex >= this.state.appForms.length - 1)) {
            return (
                <MyButtonDisabled onClick={e => { }}>{languageService(button)} </MyButtonDisabled>
            )
        }

        return (
            <MyButton onClick={button === 'prev' ? this.handlePrev : this.handleNext} style={themeService(ButtonStyle.commonButton)}>
                {languageService(button)}{" "}
            </MyButton>
        )
    }

    render() {
        let backForm = {};
        let formsStack = _.cloneDeep(this.state.formsStack);
        const form = this.state.appForms[this.state.formIndex];
        if (formsStack && !!formsStack.length) {
            backForm = formsStack.pop();
            backForm = backForm.appForms[backForm.formIndex];
        }

        return (
            <FormsWrapper>
                <Modal
                    contentClassName={themeService({ default: this.props.className, retro: "retroModal", electric: "electricModal" })}
                    isOpen={this.props.modal}
                    toggle={this.props.toggle}
                >
                    {form && (
                        <React.Fragment>
                            <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
                                {form.name}
                            </ModalHeader>
                            <ModalBody style={themeService(CommonModalStyle.body)}>
                                {(this.state.formsStack && !!this.state.formsStack.length) && (
                                    <React.Fragment>
                                        <div
                                            style={themeService({
                                                default: {
                                                    color: "var(--first)",
                                                    fontSize: "18px",
                                                    fontWeight: 600,
                                                    marginBottom: "15px",
                                                    borderBottom: "1px solid grey",
                                                    paddingBottom: "10px",
                                                },
                                                retro: {
                                                    color: retroColors.second,
                                                    fontSize: "18px",
                                                    fontWeight: 600,
                                                    marginBottom: "15px",
                                                    borderBottom: "1px solid grey",
                                                    paddingBottom: "10px",
                                                },

                                                electric: {
                                                    color: electricColors.second,
                                                    fontSize: "18px",
                                                    fontWeight: 600,
                                                    marginBottom: "15px",
                                                    borderBottom: "1px solid grey",
                                                    paddingBottom: "10px",
                                                },
                                            })}
                                        >
                                            <MyButton onClick={this.handleBack} style={themeService(ButtonStyle.commonButton)}>
                                                {languageService("Back")} {languageService("to")}
                                            </MyButton> {backForm.name}{" "}
                                        </div>
                                    </React.Fragment>
                                )}

                                <div className="form-wrapper scrollbarHor">
                                    {this.renderLayout(form)}
                                </div>
                            </ModalBody>
                            <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
                                {this.renderPrevNextButton('prev')}
                                <MyButton onClick={this.props.handleClose} style={themeService(ButtonStyle.commonButton)}>
                                    {languageService("Close")}{" "}
                                </MyButton>
                                {this.renderPrevNextButton('next')}
                            </ModalFooter>
                        </React.Fragment>
                    )}

                </Modal>
            </FormsWrapper>
        );
    }
}

export default GenericFormComponent;