import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import { ButtonMain } from 'components/Common/Buttons'
class DiagOptions extends Component {
  render() {
    let optionsCol = null
    if (this.props.list) {
      optionsCol = this.props.list.map((option, index) => {
        return <OptionCol option={option} key={index} path={this.props.path} />
      })
    }

    return (
      <Col md={12} style={{ padding: '10px' }}>
        {optionsCol}
      </Col>
    )
  }
}

export default DiagOptions

class OptionCol extends Component {
  render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <Link
          style={{
            color: 'inherit',
            textDecoration: 'none',
            ':hover': {
              color: 'inherit'
            }
          }}
          to={`${this.props.path}/` + this.props.option}
        >
          <ButtonMain buttonText={this.props.option} width="auto" padding="5px" handleClick={e => {}} />
        </Link>
      </div>
    )
  }
}
