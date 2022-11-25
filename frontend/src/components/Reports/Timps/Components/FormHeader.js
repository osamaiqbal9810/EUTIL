import React from "react";
import { Card, CardText, CardBody, Row, Col } from 'reactstrap';

export const FormHeader = (props) => {
    let { form, jPlan } = props || undefined;
    if (form && jPlan) {
        return (<Card>
            <CardBody>
                <Row>
                    <Col md={4}>
                        <CardText style={{ fontWeight: 'bold' }}>{form.assetName ? form.assetName : ""}</CardText>
                    </Col>
                    <Col md={8}>
                        <Row>
                            <label className="label-style">Inspection Status</label>
                            <p>{jPlan.status ? jPlan.status : ""}</p>
                        </Row>
                        <Row>
                            <label className="label-style">Inspection Date</label>
                            <p>{jPlan.date ? jPlan.date : ''}</p>
                        </Row>
                        <Row>
                            <label className="label-style">Inspector</label>
                            <p>{jPlan.user ? jPlan.user.name ? jPlan.user.name : "" : ""}</p>
                        </Row>
                    </Col>
                </Row>
            </CardBody>
        </Card>
        )
    }
}