import React, { Component } from 'react'
export const Comp = props => {
  console.log(props)
  return (
    <textFeildContainer obj={this.props.obj}>
      <field obj={this.props.obj} />
    </textFeildContainer>
  )
}

export const textFeildContainer = props => {
  console.log(props)
  return <div> {this.props.children} </div>
}
const field = props => <div> {this.props.obj}</div>
