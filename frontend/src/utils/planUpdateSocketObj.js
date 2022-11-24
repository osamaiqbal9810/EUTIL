import _ from 'lodash'
export const updateInspectionPlanFromSocket = (jPlansProps, jPlanProp) => {
  let jPlans = _.cloneDeep(jPlansProps)
  let indexResult = _.findIndex(jPlansProps, { planId: jPlanProp._id })
  if (indexResult || indexResult === 0) {
    jPlans[indexResult] = jPlanProp
  }
  return jPlans
}
