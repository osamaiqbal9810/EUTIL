import { Comp } from './comp'
import React, { Component } from 'react'
export const wrapper = comp => {
  let textAccessor = obj => {
    return <Comp obj={obj} />
  }
  return textAccessor
}
