const Router = require("express").Router;
const { Decimal128, ObjectId } = require("mongodb");

const db = require("../db");
const router = Router();

const products = [
  {
    name: "Stylish Backpack",
    description:
      "A stylish backpack for the modern women or men. It easily fits all your stuff.",
    price: 79.99,
    image: "http://localhost:3100/images/product-backpack.jpg",
  },
  {
    name: "Lovely Earrings",
    description:
      "How could a man resist these lovely earrings? Right - he couldn't.",
    price: 129.59,
    image: "http://localhost:3100/images/product-earrings.jpg",
  },
  {
    name: "Working MacBook",
    description:
      "Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!",
    price: 1799,
    image: "http://localhost:3100/images/product-macbook.jpg",
  },
  {
    name: "Red Purse",
    description: "A red purse. What is special about? It is red!",
    price: 159.89,
    image: "http://localhost:3100/images/product-purse.jpg",
  },
  {
    name: "A T-Shirt",
    description:
      "Never be naked again! This T-Shirt can soon be yours. If you find that buy button.",
    price: 39.99,
    image: "http://localhost:3100/images/product-shirt.jpg",
  },
  {
    name: "Cheap Watch",
    description: "It actually is not cheap. But a watch!",
    price: 299.99,
    image: "http://localhost:3100/images/product-watch.jpg",
  },
];

// Get list of products products
router.get("/", (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  const queryPage = req.query.page;
  const pageSize = 2;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }

  const products = [];
  db.getDb()
    .collection("products")
    .find()
    .sort({ price: -1 })
    // .skip((queryPage - 1) * pageSize)
    // .limit(pageSize)
    .forEach((productDoc) => {
      productDoc.price = productDoc.price.toString();
      products.push(productDoc);
    })
    .then((result) => {
      res.status(200).json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occured" });
    });
});

// Get single product
router.get("/:id", (req, res, next) => {
  db.getDb()
    .collection("products")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      result.price = result.price.toString();
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occured" });
    });
});

// Add new product
// Requires logged in user
router.post("", (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  db.getDb()
    .collection("products")
    .insertOne(newProduct)
    .then((result) => {
      console.log(result);
      res
        .status(201)
        .json({ message: "Product added", productId: result.insertedId });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Edit existing product
// Requires logged in user
router.patch("/:id", (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  db.getDb()
    .collection("products")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedProduct })
    .then((product) => {
      res
        .status(200)
        .json({ message: "Product updated", productId: req.params.id });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occured" });
    });
});

// Delete a product
// Requires logged in user
router.delete("/:id", (req, res, next) => {
  db.getDb()
    .collection("products")
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      res.status(200).json({ message: "Product deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occured" });
    });
});

module.exports = router;
