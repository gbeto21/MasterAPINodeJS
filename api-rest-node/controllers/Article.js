const testing = (req, res) => {
  return res.status(200).json({ message: "Testing" });
};

module.exports = {
  testing,
};
