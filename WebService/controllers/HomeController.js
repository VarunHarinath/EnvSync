const homeController = (req, res) => {
  try {
    res.status(200).json("API Working");
  } catch (e) {
    res.status(404).json(e);
  }
};

export { homeController };
