let ServiceLocator = require("../../../framework/servicelocator");

exports.create = async (req, res, next) => {
  let taskService = ServiceLocator.resolve("TaskService");
  let result = await taskService.createTask(req.body.workPlanTemplateTask);
  res.status(result.status);
  if (result.errorVal && result.status >= 400 && result.status <= 600) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};

exports.update = async (req, res, next) => {
  let taskService = ServiceLocator.resolve("TaskService");
  let result = await taskService.updateTask(req.body, req.params.id);
  res.status(result.status);
  if (result.errorVal && result.status >= 400 && result.status <= 600) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
exports.delete = async (req, res, next) => {
  let taskService = ServiceLocator.resolve("TaskService");
  let result = await taskService.deleteTask(req.body, req.params.id);
  res.status(result.status);
  if (result.errorVal && result.status >= 400 && result.status <= 600) {
    return res.send(result.errorVal);
  }
  res.json(result.value);
};
