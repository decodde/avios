const express = require('express');

const app = express();
const bodyParser = require("body-parser");
const {RouteControl} = require("./routes/RouteControl");

const PORT = 3000;
app.use(bodyParser());
app.use(express.static(__dirname+"/public"))
app.set('views',__dirname+"/views")
app.set('view engine', 'pug');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,DELETE,POST,GET");
  next();
});

app.get("/", RouteControl.page.shop)
app.get("/product_management", RouteControl.page.home);
app.get("/dashboard", RouteControl.page.dashboard);
app.get("/add_product", RouteControl.page.add_product);
app.get("/edit_product", RouteControl.page.edit_product);
//app.get("/delete_product", )

app.post("/signup", RouteControl.signup);
app.post("/login", RouteControl.login);

app.get("/product/:id",RouteControl.product.single);
app.get("/products", RouteControl.product.all)
app.post("/product/create",RouteControl.product.new);
app.post("/product/delete/:id",RouteControl.product.delete);
app.post("/product/update/:id",RouteControl.product.update);


app.listen(process.env.PORT || PORT ,()=> {
    console.log("Avios running");
    
})