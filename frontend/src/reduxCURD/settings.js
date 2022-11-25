let existingContainers = {}

export function saveContainer (container, name) {
  existingContainers[name] = container
}

export function containerExistCheck (container) {
  let check = false
  if (existingContainers[container]) {
    check = existingContainers[container]
  }
  return check
}