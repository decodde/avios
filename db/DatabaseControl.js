const mysql = require("mysql");
const config = require("./dbconfig");
const connection = mysql.createConnection(config);
const { Response } = require("../misc/Response");
const { Constants } = require("../misc/Constants");


const dbMethods = {
    login : async (username,password) => {

    },
    signup : async () => {

    },
    product: {
        all: async () => {
            var q = 'SELECT * FROM products';
            return new Promise((resolve, reject) => {
                connection.query(q, (e, r, f) => {
                    if (e) reject(e.message);
                    else if (r) {
                        if (r.length > 0) {
                            resolve(Response.success(Constants.DATA_RETRIEVE_SUCCESS), r);
                        }
                        else resolve(Response.success(Constants.DATA_EMPTY), r);;
                    }
                    else {
                        resolve(r);
                    }
                })
            });
        },
        single: async (id) => {
            var q = `SELECT * FROM products WHERE id = ${id}`;
            return new Promise((resolve, reject) => {
                connection.query(q, (e, r, f) => {
                    if (e) reject(e.message);
                    else if (r) {
                        if (r.length > 0) {
                            resolve(Response.success(Constants.DATA_RETRIEVE_SUCCESS, Number(r[0]["id"])));
                        }
                        else resolve(Response.success(Constants.DATA_EMPTY),[]);
                    }
                    else {
                        resolve(r);
                    }
                })
            });
        },
        new : async (product) => {
            product.date_edited = new Date();
            product.date_updated = new Date();
            var {product_name,product_description,product_varieties,date_edited,date_updated} = product;
            console.log(product)
            console.log(product_name," ",product_description)
            var val = [product_name,product_description,product_varieties,date_edited,date_updated];
            var q = `INSERT INTO products(product_name,product_description,product_varieties,date_edited,date_updated) VALUES(?,?,JSON_OBJECT('product_varieties',?),?,?)`;
            return new Promise((resolve,reject) => {
                connection.query(q, val, (e, r, f) => {
                    if (e) {
                        console.log("--here---")
                        console.log(e.errno, " ::: ", e.sqlMessage);
                        resolve(Response.error("Error with db connection",e.sqlMessage))
                    }
                    else {
                        resolve(Response.success(Constants.PRODUCT_ADDED_SUCCESS));
                    };
                })
            })
            
        }
    },
    totalBank: async (bank) => {
        var q = `SELECT COUNT(*) FROM bank${bank}`;
        return new Promise((resolve, reject) => {
            connection.query(q, (e, r, f) => {
                if (e) reject(e.message);
                else if (r) {
                    console.log(r)
                    resolve(r[0][`COUNT(*)`]);
                }
                else {
                    resolve(r);
                }
            })
        });
    },
    updateBvnRec: async () => {

    },
    delete : async () => {
        var q =`DROP TABLE products`;
        connection.query(q, (err, results, fields) => {
            if (err) console.log(err.message)
            else console.log(results)
        })
    },
    setup: async () => {
        var q = `CREATE TABLE IF NOT EXISTS products(
            id int primary key auto_increment,
            product_name char(30) NOT NULL,
            product_description char(200) NOT NULL,
            product_varieties JSON NOT NULL,
            date_updated char(30) NOT NULL,
            date_edited char(30) NOT NULL,
            KEY (product_name, id)
            )`
        connection.query(q, (err, results, fields) => {
            if (err) console.log(err.message)
            else console.log(results)
        })
    }

}

exports.DatabaseControl = dbMethods;
