module.exports = {
  LOGIN_EVENT_ID: 1,
  ADMIN_LOGIN_EVENT_ID: 2,
  CHANGED_PASSWORD_EVENT_ID: 3,
  CHANGED_ADMIN_PASSWORD_EVENT_ID: 4,
  SESSION_START_EVENT_ID: 5,
  SESSION_END_EVENT_ID: 6,
  isBodyValid(req, res, requirements) {
    for (const [key, value] of Object.entries(requirements)) {
      if (req.body[key] == undefined) {
        res.status(412).send({
          message: `Missing attribute: "${key}": <${value}>`,
        });
        return false;
      }
    }
    return true;
  },
};
