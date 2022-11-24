// COMMON TASKS ACTIONTYPE OBJECT

export let commonTasks = {}

export function setCommonTasks (tasks) {
  commonTasks = { ...commonTasks, ...tasks }
  //	console.log(commonTasks);
}
