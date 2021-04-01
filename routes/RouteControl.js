const {DatabaseControl} =  require("../db/DatabaseControl");
const { password } = require("../db/dbconfig");

const RouteControl = {
    signup : async (req,res) => {
        res.json(await DatabaseControl.signup(req.body));
    },
    login : async (req,res) => {
        let {username,password} = req.body;
        res.json(await DatabaseControl.login(username,password));
    },
    product  : {
        new : async (req,res) => {
            console.log(req.body);
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
        add_product : async (req,res) => {
            res.render("add_product");
        },
        edit_product : async (req,res) => {
            res.render("edit_product");
        },
        dashboard : async (req,res) => {
            res.render("dashboard");
        },
        home : async (req,res) => {
            res.render("home")
        }
    }
}

exports.RouteControl = RouteControl;