
const {Client, Pool} = require('pg');
const pool = new Pool({
    user: 'csce315_903_juntunen',
    host: 'csce-315-db.engr.tamu.edu',
    database: 'csce315_903_13',
    password: '630007600',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});
//get orders function with a query

const getOrders = async () => {
    //test addorder
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM orders', async (error, results) => {
        if (error) {
            console.log("bad");
            reject(error)
        }
        //console.log("here1");
        //console.log(results.rows[0]['product_id']);
        //get the description of the product in each order and replace the product id with the description
        pool.query('SELECT * FROM product', (error, results2) => {
            if (error) {
                console.log("bad");
                reject(error)
            }
            //console.log("here");
            //console.log(results.rows[0]['product_id']);
            for (var i = 0; i < results.rows.length; i++){
                var temp = results.rows[i]['product_ids'];  
                var temp2 = [];
                for (var j = 0; j < temp.length; j++){
                    for (var k = 0; k < results2.rows.length; k++){
                        if (temp[j] == results2.rows[k]['product_id']){
                            temp2.push(results2.rows[k]['description']);
                            //console.log(results2.rows[k]['description']);
                        }
                    }
                }
                results.rows[i]['product_ids'] = temp2;
            }

        })




        //wait 2 seconds
        await new Promise(r => setTimeout(r, 1500));


        resolve(results.rows);
        //console.log(results.rows[0]['description']);
        })
        
        //console.log("here");
    }) 
}


const addOrder = async (order) => { 
    id_list = "{";
    quant_list = "{";
    total_price = 0;
    async function get_ids(){
        return new Promise((resolve, reject) => {
            for (var i = 0; i < order.length; i++){
                pool.query("SELECT * from product where description='" + String(order[i].name) + "';", (error, get_id) => {
                    //minus 1 from the inventory for each item in the prooduct
                    pool.query("UPDATE ingredient SET quantity = quantity - 1 WHERE ing_id = ANY ('{" + String(get_id.rows[0]['ing_id']) + "}');", (error, results) => {
                        if (error) {
                            console.log("bad");
                            reject(error)
                        }
                    })
                    //console.log("UPDATE ingredient SET quantity = quantity - 1 WHERE ing_id = ANY ('{" + String(get_id.rows[0]['ing_id']) + "}');");

                    id_list += String(get_id.rows[0]['product_id']) + ",";
                    //console.log(get_id.rows[0]['product_id']);
                    //console.log("in loop", id_list);
                });
                //add quantity to string list
                quant_list += String(order[i].quantity) + ",";
                //add price to total price
                total_price += order[i].price * order[i].quantity;

            }
            resolve();
        });
           
    }
    //wait for 2 seconds
    get_ids()
    // await new Promise(resolve => get_ids());
    //wait until above loop is done using await promise
    await new Promise(resolve => setTimeout(resolve, 2000));
    id_list = id_list.slice(0, -1);
    id_list += "}";
    quant_list = quant_list.slice(0, -1);
    quant_list += "}";
    //get the date and time 
    var date = new Date();
    var date_string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    //put 0 in front of time if less than 10
    if (date.getMinutes() < 10){
        date_string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":0" + date.getMinutes() + ":" + date.getSeconds();
    }
    if (date.getSeconds() < 10){
        date_string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":0" + date.getSeconds();
    }
    if (date.getMinutes() < 10 && date.getSeconds() < 10){
        date_string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":0" + date.getMinutes() + ":0" + date.getSeconds();
    }
    //get max id from order table
    var max_id = 0;
    function get_max_id(){
        return new Promise((resolve, reject) => {
            pool.query("SELECT MAX(id) from orders;", (error, get_id) => {
                max_id = String(get_id.rows[0]['max']+1);
                //console.log(max_id);
            });
            resolve();
        });
    }
    get_max_id();
    await new Promise(resolve => setTimeout(resolve, 1500));
    //max_id = String(max_id + 1);
    total_price = String(total_price);
    //console.log(date_string);
    //console.log(id_list);
    //console.log(quant_list);
    //console.log(total_price);
    //console.log("max_id", max_id);
        //     //"INSERT INTO orders(id, order_num, product_ids, in_progress, is_completed, total_price, date) VALUES(" + Main.order_id + ", " + Main.order_num + ", '" + id_list + "', FALSE, TRUE, " + total_price + ", '" + date + " " + time + "');"

    //make query string
    var query_string = "INSERT INTO orders(id, order_num, product_ids, in_progress, is_completed, total_price, date, quantity) VALUES(" + max_id + ", " + max_id + ", '" + id_list + "', FALSE, TRUE, " + total_price + ", '" + date_string + "', '" + quant_list + "');";
    console.log(query_string);
    //add order to database
    return new Promise((resolve, reject) => {
        pool.query(query_string , (error, results) => {
            if (error) {
                throw error
            }
            console.log("added order");
        });
        resolve();
    });
}

const getProduct = async () => {
    //test addorder
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM product order by product_id', (error, results) => {
        if (error) {
            console.log("bad");
            reject(error)
        }
        //console.log(results.rows[0]['product_id']);
        resolve(results.rows);
        //console.log(results.rows[0]['description']);
        })
        
        //console.log("here");
    }) 
}
//get invetory query
const getInv = async () => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM ingredient order by ing_id', (error, results) => {
        if (error) {
            console.log("bad");
            reject(error)
        }
        resolve(results.rows);
        })

    })
}

const getMenu = async () => {
    //get the ingredients and swap the ingredient id with the ingredient name
    ing_list = [];
    

    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM product order by product_id', async (error, results) => {
            if (error) {
                console.log("bad");
                reject(error)
            }
            pool.query('SELECT * FROM ingredient order by ing_id', (error, result) => {
                if (error) {
                    console.log("bad");
                    reject(error)
                }
                for (var i = 0; i < result.rows.length; i++){
                    ing_list.push({i_id: result.rows[i]['ing_id'], name: result.rows[i]['name']});
                }
                //change the ingredient id to the ingredient name for each ingredient in each product
                for (var i = 0; i < results.rows.length; i++){
                    var ing = results.rows[i]['ing_id'];
                    for (var j = 0; j < ing.length; j++){
                        for (var k = 0; k < ing_list.length; k++){
                            if (ing[j] == ing_list[k].i_id){
                                ing[j] = ing_list[k].name;
                            }
                        }
                    }
                    results.rows[i]['ing_id'] = ing;
                }
            
            })
            await new Promise(resolve => setTimeout(resolve, 1500));
            resolve(results.rows);
        })
    })
}

const getEmployees = async () => {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM employee', (error, results) => {
            if(error) {
                console.log("getEmployees bad");
                reject(error)
            }
            resolve(results.rows);
        })
    })
}

const putProduct = async (product) => {
    //update the product table at the id with the new values
    console.log("put product");
    console.log(product.name);
    var name = product.name;
    var price = product.price;
    var ing = product.ing;
    var id = product.product_id;
    var cat = product.category;
    //query ingredients table to get the ingredient id and convert the ingredient name to the id
    var ing_ids = "";
    var ing_list = [];
    pool.query('SELECT * FROM ingredient order by ing_id', (error, result1) => {
        if (error) {
            console.log("bad");
            reject(error)
        }
        for (var i = 0; i < result1.rows.length; i++){
            ing_list.push({i_id: result1.rows[i]['ing_id'], name: result1.rows[i]['name']});
        }
        //change the ingredient id to the ingredient name for each ingredient in each product
        for (var i = 0; i < ing.length; i++){
            for (var j = 0; j < ing_list.length; j++){
                if (ing[i] == ing_list[j].name){
                    ing_ids += String(ing_list[j].i_id);
                    if(i != ing.length - 1){
                        ing_ids += ", ";
                    }
                }
            }
        }
        //console.log(ing_ids);
        
        resolve(results.rows);
        })

    
}

// const getMenu = async () => {
//     //get the ingredients and swap the ingredient id with the ingredient name
//     ing_list = [];
    

//     return new Promise(function(resolve, reject) {
//         pool.query('SELECT * FROM product order by product_id', async (error, results) => {
//             if (error) {
//                 console.log("bad");
//                 reject(error)
//             }
//             pool.query('SELECT * FROM ingredient order by ing_id', (error, result) => {
//                 if (error) {
//                     console.log("bad");
//                     reject(error)
//                 }
//                 for (var i = 0; i < result.rows.length; i++){
//                     ing_list.push({i_id: result.rows[i]['ing_id'], name: result.rows[i]['name']});
//                 }
//                 //change the ingredient id to the ingredient name for each ingredient in each product
//                 for (var i = 0; i < results.rows.length; i++){
//                     var ing = results.rows[i]['ing_id'];
//                     for (var j = 0; j < ing.length; j++){
//                         for (var k = 0; k < ing_list.length; k++){
//                             if (ing[j] == ing_list[k].i_id){
//                                 ing[j] = ing_list[k].name;
//                             }
//                         }
//                     }
//                     results.rows[i]['ing_id'] = ing;
//                 }
            
//             })
//             await new Promise(resolve => setTimeout(resolve, 1500));
//             resolve(results.rows);
//         })
//     })
// }

// const putProduct = async (product) => {
//     //update the product table at the id with the new values
//     console.log("put product");
//     console.log(product.name);
//     var name = product.name;
//     var price = product.price;
//     var ing = product.ing;
//     var id = product.product_id;
//     var cat = product.category;
//     //query ingredients table to get the ingredient id and convert the ingredient name to the id
//     var ing_ids = "";
//     var ing_list = [];
//     pool.query('SELECT * FROM ingredient order by ing_id', (error, result1) => {
//         if (error) {
//             console.log("bad");
//             reject(error)
//         }
//         for (var i = 0; i < result1.rows.length; i++){
//             ing_list.push({i_id: result1.rows[i]['ing_id'], name: result1.rows[i]['name']});
//         }
//         //change the ingredient id to the ingredient name for each ingredient in each product
//         for (var i = 0; i < ing.length; i++){
//             for (var j = 0; j < ing_list.length; j++){
//                 if (ing[i] == ing_list[j].name){
//                     ing_ids += String(ing_list[j].i_id);
//                     if(i != ing.length - 1){
//                         ing_ids += ", ";
//                     }
//                 }
//             }
//         }
//         //console.log(ing_ids);
        
//     })

//     await new Promise(resolve => setTimeout(resolve, 1500));
//     return new Promise(function(resolve, reject) {
//         pool.query("UPDATE product SET name = '" + name + "', price = " + price + ", cat_id = " + cat + ", ing_id = '{" + ing_ids + "}', description = '" + name + "' WHERE product_id = " + id + ";", (error, results) => {
//             if (error) {
//                 console.log("error editing product");
//                 reject(error)
//             }
//             resolve("results.rows");
//             //console.log("UPDATE product SET name = '" + name + "', price = " + price + ", ing_id = '{" + ing_ids + "}', description = '" + name + "' WHERE product_id = " + id + ";");

//         })
//     })
// }

//post inventory
const addInv = async (ing) => {
    //add the ingredient to the inventory
    console.log("post inventory");
    

    return new Promise(function(resolve, reject) {
        pool.query("INSERT INTO ingredient(ing_id, name, quantity) VALUES(" + ing.inv_id + ", '" + ing.name + "', " + ing.stock + ");", (error, results) => {
            if (error) {
                console.log("error adding ingredient");
                reject(error)
            }
            resolve("results.rows");
        })
    })
}

const deleteInv = async (ing) => {
    //delete the ingredient from the inventory
    console.log("delete inventory");
    console.log(ing);
    return new Promise(function(resolve, reject) {
        pool.query("DELETE FROM ingredient WHERE ing_id = " + ing.inv_id + ";", (error, results) => {
            if (error) {
                console.log("error deleting ingredient");
                reject(error)
            }
            resolve("results.rows");
        })
    })
}

const putInv = async (ing) => {
    //update the ingredient in the inventory
    console.log("put inventory");

    return new Promise(function(resolve, reject) {
        pool.query("UPDATE ingredient SET name = '" + ing.name + "', quantity = " + ing.stock + " WHERE ing_id = " + ing.inv_id + ";", (error, results) => {
            if (error) {
                console.log("error editing ingredient");
                reject(error)
            }
            resolve("results.rows");
        })
    })
}




const deleteProduct = async (id) => {
    //delete the product at the id
    //q: how do i access the id from the url
    console.log(id);
    console.log(id.value);
    return new Promise(function(resolve, reject) {
        pool.query("DELETE FROM product WHERE product_id = " + id.product_id + ";", (error, results) => {
            if (error) {
                console.log("DELETE FROM product WHERE product_id = " + id.product_id + ";");
                reject(error)
            }
            resolve("deleted product");
        })
    })

}

//add product to database
const addProduct = async (product) => {
    // console.log("add product");
    // console.log(product.name);
    // console.log(product.price);
    // console.log(product.ing);
    // console.log(product.category);
    // console.log(product.stock);

    return new Promise(async function(resolve, reject) {
        //query ingredients table to get the ingredient id and convert the ingredient name to the id
        var ing_ids = "";
        var ing_list = [];
        pool.query('SELECT * FROM ingredient order by ing_id', (error, result1) => {
            if (error) {
                console.log("ingredient query bad");
                reject(error)
            }
            for (var i = 0; i < result1.rows.length; i++){
                ing_list.push({i_id: result1.rows[i]['ing_id'], name: result1.rows[i]['name']});
            }
            //console.log(ing_list);
            //change the ingredient id to the ingredient name for each ingredient in each product
            for (var i = 0; i < product.ing.length; i++){
                for (var j = 0; j < ing_list.length; j++){
                   // console.log(product.ing[i]);
                    if (product.ing[i] == ing_list[j].name){
                        //console.log("found ingredient");
                        ing_ids += String(ing_list[j].i_id);
                        if(i != product.ing.length - 1){
                            ing_ids += ", ";
                        }
                    }
                }
            }
            //console.log("id", ing_ids);

        })
        await new Promise(resolve => setTimeout(resolve, 1500));
        pool.query("INSERT INTO product (product_id, name, description, stock, cat_id, price, ing_id) VALUES (" + product.product_id + ", '" + product.name + "', '" + product.name + "', 0, " + product.category + ", " + product.price + ", '{" + ing_ids + "}');", (error, results) => {
            if (error) {
                console.log("error adding product");
                reject(error)
            }
            resolve("results.rows");
        })
    })
}






// app.listen(process.env.PSQL_PORT, () => {
//     console.log(`App server now listening to port ${process.env.PSQL_PORT}`);
// });

// app.get('/api/users', (req, res) => {
//     pool.query(`select * from product`, (err, rows) => {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send(rows);
//         }
//     });
// });

// google translate API
const {Translate} = require('@google-cloud/translate').v2;
const TRANSLATE_KEY = "AIzaSyCqejAxyPau3Af0EqN-hmLL2WGiPjV5Lf8";

const translateText = async (req, res, next) => {
    const targetLanguage = req.body.targetLanguage;
    const text = req.body.text;
    const translate = new Translate({key: TRANSLATE_KEY});

   //console.log('target language is ' + targetLanguage);
    //console.log('text is ' + text);

    try {
        let [response] = await translate.translate(text, targetLanguage);
        //console.log('translation is successful');
        res.status(200).json(response);
    } catch (error) {
        //console.log('translation failed');
        res.status(500).json(error);
    }
}

module.exports = {
    getProduct,
    addOrder,
    getOrders,
    getInv,
    getMenu,
    putProduct,
    deleteProduct,
    addProduct,
    addInv,
    deleteInv,
    putInv,
    translateText,
    getEmployees,
}