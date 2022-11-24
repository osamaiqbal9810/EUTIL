import React, { Component } from 'react'

class Logout extends Component {
  componentDidMount() {
    let user = JSON.parse(localStorage.getItem('loggedInUser'))
    if (user) {
      this.props.onLogoutRequest(user._id)
    }
    this.props.clearStore()

    this.props.history.push('/login')
  }

  render() {
    return <div />
  }
}

export default Logout
