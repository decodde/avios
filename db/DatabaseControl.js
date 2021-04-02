const mysql = require("mysql");
const config = require("./dbconfig");
const connection = mysql.createConnection(config);
const crypt = require("crypto");
const { Response } = require("../misc/Response");
const { Constants } = require("../misc/Constants");

const hashPassword = (password) => {
    var mykey = crypt.createCipher('aes-256-gcm', "avios", null);
    var mystr = mykey.update(password, 'utf8', 'hex');
    mystr += mykey.final('hex');
    return mystr;
}

const dbMethods = {
    login: async (username, password) => {
        var q = `SELECT * FROM avios_users WHERE username = '${username}' LIMIT 0,1`;
        return new Promise(async (resolve, reject) => {
            connection.query(q, (e, r, f) => {
                if (e) reject(e.message);
                else if (r) {
                    if (r.length > 0) {
                        if (r[0]["password"] == hashPassword(password)) {
                            resolve(Response.success(Constants.LOGIN_SUCCESS, r[0]));
                        }
                        else {
                            resolve(Response.error(Constants.LOGIN_FAILED))
                        }
                    }
                    else resolve(Response.error(Constants.DATA_EMPTY), r);;
                }
                else {
                    resolve(r);
                }
            })
        });
    },
    signup: async (user) => {
        var { signupUsername, signupPassword, type } = user;
        //console.log(user);
        if (signupUsername && signupPassword) {
            var dateJoined = new Date();
            signupPassword = hashPassword(signupPassword);
            type ? type = type.toLowerCase() : type = "buyer";
            var q = `INSERT INTO avios_users (username,password,date_joined,type) VALUES(?,?,?,?)`;
            var val = [signupUsername, signupPassword, dateJoined, type];
            return new Promise((resolve, reject) => {
                connection.query(q, val, (e, r, f) => {
                    if (e) {
                        console.log("--here---")
                        console.log(e.errno, " ::: ", e.sqlMessage);
                        resolve(Response.error("Error with db connection", e.sqlMessage))
                    }
                    else {
                        resolve(Response.success(Constants.SIGNUP_SUCCESS));
                    };
                })
            })
        }
        else return Response.error("Incomplete fields");

    },
    product: {
        delete: async (id) => {
            var q = `DELETE FROM products WHERE id = '${id}'`
            return new Promise((resolve, reject) => {
                connection.query(q, (e, r, f) => {
                    if (e) resolve(Response.error(`${Constants.DELETE_FAILED} ${id}`, e.message));
                    else resolve(Response.success(Constants.DELETE_SUCCESS))
                })
            });
        },
        all: async () => {
            var q = 'SELECT * FROM products';
            return new Promise((resolve, reject) => {
                connection.query(q, (e, r, f) => {
                    if (e) reject(e.message);
                    else if (r) {
                        if (r.length > 0) {
                            resolve(r);
                        }
                        else resolve(r);;
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
                            resolve(Response.success(Constants.DATA_RETRIEVE_SUCCESS, r[0]));
                        }
                        else resolve(Response.success(Constants.DATA_EMPTY), []);
                    }
                    else {
                        resolve(r);
                    }
                })
            });
        },
        new: async (product) => {
            product.date_edited = new Date();
            product.date_updated = new Date();
            var { product_name, product_description, product_varieties, date_edited, date_updated } = product;
            //console.log(product)
            //console.log(product_name, " ", product_description)
            var val = [product_name, product_description, JSON.stringify(product_varieties), date_edited, date_updated];
            var q = `INSERT INTO products(product_name,product_description,product_varieties,date_edited,date_updated) VALUES(?,?,?,?,?)`;
            return new Promise((resolve, reject) => {
                connection.query(q, val, (e, r, f) => {
                    if (e) {
                        //console.log("--here---")
                        console.log(e.errno, " ::: ", e.sqlMessage);
                        resolve(Response.error("Error with db connection", e.sqlMessage))
                    }
                    else {
                        resolve(Response.success(Constants.PRODUCT_ADDED_SUCCESS));
                    };
                })
            })

        }
    },
    delete: async () => {
        var q = `DROP TABLE products`;
        connection.query(q, (err, results, fields) => {
            if (err) console.log(err.message)
            else console.log(results)
        })
    },
    delete2: async () => {
        var q = `DROP TABLE avios_users`;
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
    },

    setup2: async () => {
        var q = `CREATE TABLE IF NOT EXISTS avios_users(
            id int primary key auto_increment,
            username char(30) NOT NULL,
            password char(200) NOT NULL,
            date_joined char(30) NOT NULL,
            type char(9) NOT NULL,
            KEY (username, id)
            )`
        connection.query(q, (err, results, fields) => {
            if (err) console.log(err.message)
            else console.log(results)
        })
    }

}

exports.DatabaseControl = dbMethods;
