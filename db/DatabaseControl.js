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
        new : async (details) => {
            var product = details;
            product.date_edited = new Date();
            product.date_updated = new Date();
            
            var val = [product_name,product_description,];
            var q = `INSERT INTO products(product_name,product_description,date_edited,date_updated) VALUES(?,?,?,?,?)`;
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
    insertRecCount: async (id, bank) => {
        var q = `UPDATE bvnRecCount SET id = ? WHERE bankCode = ?`;
        var val = [id, bank];
        return new Promise((resolve, reject) => {
            connection.query(q, val, (e, r, f) => {
                if (e) {
                    console.log("error inserting:: ", e.message);
                    reject(e);
                }
                else resolve(r);
            })
        })
    },
    gR: async (bank) => {
        var q = `SELECT * FROM bvnRecCount WHERE bankCode = ${bank}`;
        return new Promise((resolve, reject) => {
            connection.query(q, (e, r, f) => {
                if (e) reject(e.message);
                else if (r) {
                    if (r.length > 0) {
                        resolve(Number(r[0]["id"]));
                    }
                    else resolve(Number(0));
                }
                else {
                    console.log("2else: ", r)
                    resolve(r);
                }
            })
        });
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
    bvnExists: async (bvn) => {
        var q = `SELECT * FROM bvnRec WHERE bvn = '${bvn}'`;
        return new Promise((resolve, reject) => {
            connection.query(q, (e, r, f) => {
                if (e) {
                    console.log("--herree");
                    //console.log(e.message);
                    reject(e);
                }
                else if (r.length > 0) {
                    console.log("bvn rec exists");
                    resolve(true);
                }
                else resolve(false);
            });
        });
    },
    totalRecord: async () => {
        var q = `SELECT COUNT(*) FROM bvnRec`;
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
    selectAndGen: async (id, bank) => {
        var q = `SELECT bvn FROM bank${bank} WHERE id = '${id}'`
        return new Promise((resolve, reject) => {
            connection.query(q, (e, r, f) => {
                if (e) reject(e.message);
                else if (r.length > 0) {
                    var bvn = r[0].bvn;
                    resolve(bvn);
                }
                else {
                    console.log(")(");
                    console.log(r)
                    resolve(null);
                }
            });
        })
    },
    updateBvnRec: async () => {

    },
    setup: async () => {
        var q = `CREATE TABLE IF NOT EXISTS products(
            id int primary key auto_increment,
            product_name char(30) NOT NULL
            product_description char(30) NOT NULL,
            procuct_varieties char(30) NOT NULL,
            date_uploaded char(30) NOT NULL,
            date_edited char(30) NOT NULL,
            product_id char(10) NOT NULL,
            KEY (product_name )
            )`
        connection.query(q, (err, results, fields) => {
            if (err) console.log(err.message)
            else console.log(results)
        })
    }

}

exports.DatabaseControl = dbMethods;
