const homeController = (req, res) => {
  try {
    res.status(200).json("API Working");
  } catch (e) {
    next(e);
  }
};

export { homeController };
