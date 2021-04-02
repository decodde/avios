const {DatabaseControl} =  require("../db/DatabaseControl");
const { password } = require("../db/dbconfig");

const RouteControl = {
    auth : (req,res,next) => {
        if(req.session.user){
            next();
        }
        else {
            var err = new Error("User not logged in");
            res.render("403");
        }
    },
    signup : async (req,res) => {
        var user = req.body;
        let trySignup = await DatabaseControl.signup(user);
        if(trySignup.type == "success"){
            req.session.user = user;
            if(user.type == "seller"){
                res.status = 302;
                res.redirect("/dashboard");
            }
            else {
                res.redirect("/");
            }
        }
        else{
            res.render("home",{message : trySignup.msg});
        }
    },
    login : async (req,res) => {
        let {loginUsername,loginPassword} = req.body;
        let tryLogin = await DatabaseControl.login(loginUsername,loginPassword);
        console.log(tryLogin);
        if (tryLogin.type == "success"){
            var user = tryLogin.data;
            req.session.user = user;
            console.log(user)
            if(user.type == "seller"){
                res.redirect("/dashboard");
            }
            else {
                res.redirect("/");
            }
        }
        else {
            res.render("home",{message : "Invalid Login"});
        }
    },
    logout : async (req,res) => {
        req.session.destroy();
        res.redirect("/");
    },
    product  : {
        new : async (req,res) => {
            console.log("check::: ",req.body);
            res.json(await DatabaseControl.product.new(req.body));
        },
        delete : async (req,res) => {
            let {id} = req.params;
            res.json(await DatabaseControl.product.delete(id));
        },
        update : async (req,res) => {

        },
        single : async (req,res) => {
            let {id} = req.params;
            res.json(await DatabaseControl.product.single(id));
        },
        all: async (req,res) => {
            res.json(await DatabaseControl.product.all());
        }
    },
    page : {
        shop : async (req,res) => {
            var products = await DatabaseControl.product.all();
            var user = req.session.user;
            if (user) {
                if (user.type == "seller"){
                    res.render("shop",{products:products,user : user});
                }
            }
            else res.render("shop",{products:products});
        },
        add_product : async (req,res) => {
            var user = req.session.user;
            res.render("add_product", {user : user});
        },
        edit_product : async (req,res) => {
            var {id} = req.params;
            var product = await DatabaseControl.product.single(id);
            res.render("edit_product",{product:product});
        },
        delete_product : async (req,res) => {
            var user = req.session.user;
            var {id} = req.params;
            var product = await DatabaseControl.product.single(id);
            console.log(product)
            res.render("delete_product",{product:product.data,user:user});
        },
        dashboard : async (req,res) => {
            var user = req.session.user;
            var products = await DatabaseControl.product.all();
            res.render("dashboard",{user:user, products: products});
        },
        home : async (req,res) => {
            res.render("home")
        }
    }
}

exports.RouteControl = RouteControl;