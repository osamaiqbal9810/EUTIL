import React, { Fragment } from 'react';
import { Col, Row } from 'reactstrap';

// use this as a sample to provide the master key for your report
const exampleMasterKey = [
    { key: 'C', value: 'Test completed, no exceptions found, and condition left in compliance.' },
    { key: 'A', value: 'Adjustments made (identified in associated comments), test completed, and condition left in compliance.' },
    { key: 'R', value: 'Repairs and/or Replacements made (identified in associated comments), test completed, and condition left in compliance.' },
    { key: 'B', value: 'Baseline data matches that recorded during the most recent Baseline test, so full test not required.' },
    { key: 'G', value: 'Governed by Special Instruction.' },
    { key: 'NT', value: 'The equipment was not tested in this inspection.' },
    { key: 'N', value: 'Test Not Applicable.' },
    { key: 'NI', value: 'No Inspection Required.' },
    { key: 'CO', value: 'Compliant' },
    { key: 'NC', value: 'Not compliant' },
    { key: 'P', value: 'Pass' },
    { key: 'F', value: 'Fail' },
]

const ReportFraConditionsMasterKey = ({ masterKey }) => {
    return (
        <Fragment>
            <Row>
                <Col md={12}>
                    <div className="fra-masterkey-title">
                        <span>Conditions Master Key</span>
                    </div>
                    <div className="fra-masterkey-values">
                        {masterKey.map(item => <div>{`${item.key} = ${item.value}`}</div>)}
                    </div>
                </Col>
            </Row>
        </Fragment>
    );
};

export default ReportFraConditionsMasterKey;