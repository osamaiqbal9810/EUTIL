/* eslint eqeqeq: 0 */
import React, { Component } from 'react'
import Radium from 'radium'
import AssetTabs from 'components/Common/Tabs/CommonTabs'
class AssetTypeFieldsTab extends Component {
  constructor(props) {
    super(props)

    this.handleTabClick = this.handleTabClick.bind(this)
  }
  handleTabClick(tab) {
    this.props.selectedTabSet(tab, this.props.callerName)
  }

  render() {
    // const styles = getStyles(this.props, this.state)
    let tabsComp = null
    if (this.props.assetTypeTabs) {
      let tabsCompObj = this.props.assetTypeTabs.map((tab, index) => {
        if (tab.value == this.props.selectedTab) {
          tab.state = true
        } else {
          tab.state = false
        }
        return (
          <div style={{ display: 'inline-block' }} key={tab + index}>
            <AssetTabs tabValue={tab.value} tabState={tab.state} handleTabClick={this.handleTabClick} />
          </div>
        )
      })
      tabsComp = (
        <div style={{ backgroundColor: '#e3e9ef', borderRadius: '30px', width: 'fit-content', marginBottom : "20px" }}> {tabsCompObj} </div>
      )
    }

    return <div>{tabsComp} </div>
  }
}

export default Radium(AssetTypeFieldsTab)

// let getStyles = (props, state) => {}
