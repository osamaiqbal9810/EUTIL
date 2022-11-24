let UserHours = require("./userHours.model");
let _ = require("lodash");

exports.show = function(req, res, next) {
  /*UserHours.create(userAvailability,function (err, userHours) {
        if (err) return handleError(res, err);
        //console.log(userHours);
        res.json(userHours);
    });*/
  UserHours.findOne({ userId: req.params.id }, function(err, userHours) {
    if (err) return handleError(res, err);
    if (!userHours) return res.status(201).send("");
    res.json(userHours);
  });
};
exports.update = function(req, res, next) {
  //console.log(req.params.id);
  UserHours.findOne({ userId: req.params.id }, function(err, userAvailability) {
    if (err) return handleError(res, err);
    if (!userAvailability) {
      let availability = new UserHours({
        userId: req.params.id,
        userHours: req.body.userHours,
        userLocLogging: req.body.userLocLogging,
      });
      availability.save(function(err, savedData) {
        if (err) {
          return handleError(res, err);
        }
        //console.log("Successfully added user hours");
        res.status(201);
        return res.json(savedData);
      });
    } else {
      userAvailability.userHours = req.body.userHours;
      userAvailability.userLocLogging = req.body.userLocLogging;

      //let updated = _.merge(userHours, req.body);
      userAvailability.save(function(err, updatedHours) {
        if (err) {
          return handleError(res, err);
        }
        res.status(200);
        return res.json(updatedHours);
      });
    }
  });
};
function handleError(res, err) {
  res.status(500);
  return res.send(err);
}
