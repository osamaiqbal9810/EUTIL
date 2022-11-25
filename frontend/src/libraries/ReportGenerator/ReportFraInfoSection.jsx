import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { LocPrefixService } from "../../components/LocationPrefixEditor/LocationPrefixService";
import { CRUDFunction } from "../../reduxCURD/container";

class ReportFraInfoSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            railroadName: '',
            lineName: '',
            milepostWithPrefix: '',
            location: '',
            name: '',
            assetId: '',
            date: ''
        }
    }
    componentDidMount() {
        const { selectedAssetId } = this.props;
        if (selectedAssetId) this.props.getAssetReportHeader("getAssetWithParents/" + this.props.selectedAssetId);
    }

    componentDidUpdate(prevProps, prevState) {
        const { assetReportHeader } = this.props;
        if (this.props.actionType === "ASSETREPORTHEADER_READ_SUCCESS" && this.props.actionType !== prevProps.actionType) {
            this.setHeaderData(assetReportHeader);
        }
    }

    setHeaderData(container) {
        const { data } = this.props;
        let subDiv = null;
        let subLocation = null;
        let railroad = null;

        let asset = container && container.asset;
        if (container && asset && container.parents) {
            subLocation = container.parents.find((pAsset) => asset.parentAsset === pAsset._id);
            if (subLocation) subDiv = container.parents.find((pAsset) => subLocation.parentAsset === pAsset._id);
            railroad = container.parents[container.parents.length - 1] ? container.parents[container.parents.length - 1].unitId : '';
        }
        this.setState({
            railroadName: railroad,
            lineName: data && data.lineName ? data.lineName : '',
            milepostWithPrefix: data.mp && data.lineId && data.mp ? LocPrefixService.getPrefixMp(data.mp, data.lineId) + " " + data.mp : '',
            location: asset.unitId,
            name: data && data.userName ? data.userName : '',
            assetId: data && asset && asset.attributes && asset.attributes["Asset ID"]
                ? asset.attributes["Asset ID"] : data.assetUnitId,
            date: data && data.date ? data.date : ''
        });
    }
    render() {
        const { railroadName, lineName, milepostWithPrefix, location, name, assetId, date } = this.state;
        return (
            <React.Fragment>
                <Row>
                    <Col md={12}>
                        <div className="fra-info-section">
                            <Row>
                                <Col md={6}>
                                    <div className="heading-info">
                                        <strong>Railroad:</strong>
                                        <span>{railroadName}</span>
                                    </div>
                                    <div className="heading-info">
                                        <strong>Subdivision:</strong>
                                        <span>{lineName}</span>
                                    </div>
                                    <div className="heading-info">
                                        <strong>Milepost (with Prefix):</strong>
                                        <span>
                                            {milepostWithPrefix}
                                        </span>
                                    </div>
                                    <div className="heading-info">
                                        <strong>Location:</strong>
                                        <span>{location}</span>
                                    </div>
                                    <div className="heading-info">
                                        <strong>Employee’s Name:</strong>
                                        <span>{name}</span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="heading-info">
                                        <strong>Asset ID: </strong>
                                        <span>{assetId}</span>
                                    </div>
                                    <div className="heading-info">
                                        <strong>Test Date:</strong>
                                        <span>{date}</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}
const ReportFraInfoSectionContainer = CRUDFunction(ReportFraInfoSection, "assetReportHeader", null, null, null, "asset");
export default ReportFraInfoSectionContainer;
