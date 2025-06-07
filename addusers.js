const user = [];
const add = (req, res) => {
  const plus = { name: req.body.name, password: req.body.password };
  user.push(plus);
  res.json(user);
};

module.exports = add;
