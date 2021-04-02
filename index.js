const express = require('express');

const app = express();
var session = require('express-session');
const uuid = require("uuid");
const bodyParser = require("body-parser");
const PORT = 3000;
app.use(session({
  maxAge: 600000,
  secret: 'avios_shop',
  resave: true,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + "/views");
app.set('view engine', 'pug');

const { RouteControl } = require("./routes/RouteControl");
const { DatabaseControl } = require('./db/DatabaseControl');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,DELETE,POST,GET");
  next();
});

app.get("/", RouteControl.page.shop)
app.get("/login", RouteControl.page.home);
app.get("/logout", RouteControl.logout);
app.get("/dashboard", RouteControl.auth, RouteControl.page.dashboard);
app.get("/add_product", RouteControl.auth, RouteControl.page.add_product);
app.get("/edit_product_:id", RouteControl.auth, RouteControl.page.edit_product);
app.get("/delete_product:id", RouteControl.auth, RouteControl.page.delete_product);

app.get("/product/delete/:id", RouteControl.auth, RouteControl.product.delete);
app.get("/product/update/:id", RouteControl.auth, RouteControl.product.update);

app.post("/signup", RouteControl.signup);
app.post("/login", RouteControl.login);

app.get("/product/:id", RouteControl.product.single);
app.get("/products", RouteControl.product.all)
app.post("/product/create", RouteControl.product.new);
app.post("/product/delete/:id", RouteControl.auth, RouteControl.product.delete);
app.post("/product/update/:id", RouteControl.auth, RouteControl.product.update);

DatabaseControl.setup();

app.listen(process.env.PORT || PORT, () => {
  console.log("Avios running");

})