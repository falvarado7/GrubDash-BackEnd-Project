const path = require("path");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));
// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Middleware Validation Functions for Create and Update Functions
function bodyHasNameProperty(req, res, next) {
  const { data = {} } = req.body;
  if (!data.name) {
    next({
      status: 400,
      message: "Dish must include a name"
    })
  }
  res.locals.reqBody = data
  return next();
}

function bodyHasDescProperty(req, res, next) {
  const reqBody = res.locals.reqBody;
  if (!reqBody.description) {
    next({
      status: 400,
      message: "Dish must include a description"
    })
  }
  return next();
}

function bodyHasPriceProperty(req, res, next) {
  const reqBody = res.locals.reqBody;
  if (!reqBody.price || reqBody.price < 0 || typeof reqBody.price !== "number" ) {
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0"
    })
  }
  return next();
}

function bodyHasImgUrl(req, res, next) {
  const reqBody = res.locals.reqBody;
  if (!reqBody["image_url"]) {
    next({
      status: 400,
      message: "Dish must include a image_url"
    })
  }
  return next();
}

// Middleware Validation Functions for Read and Update Functions
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId)
  if (foundDish) {
    res.locals.dish = foundDish
    res.locals.dishId = dishId
    return next()
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}`
  })
}

// TODO: Implement the /dishes handlers needed to make the tests pass
function create(req, res) {
  const reqBody = res.locals.reqBody;
  const newDish = {
    ...reqBody,
    id: nextId,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish })
}

function read(req, res) {
  res.status(200).json({ data: res.locals.dish})
}

function update(req,res) {

}

function list(req, res) {
  res.status(200).json({ data: dishes });
};

module.exports = {
  create: [bodyHasNameProperty, bodyHasDescProperty, bodyHasPriceProperty, bodyHasImgUrl, create],
  read: [dishExists, read],
  update,
  list,
}