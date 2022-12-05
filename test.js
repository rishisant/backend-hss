
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
        pool.query('SELECT * FROM orders', (error, results) => {
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
const addOrder = async (order) => { 
    id_list = "{";
    quant_list = "{";
    total_price = 0;
    async function get_ids(){
        return new Promise((resolve, reject) => {
            for (var i = 0; i < order.length; i++){
                pool.query("SELECT * from product where description='" + String(order[i].name) + "';", (error, get_id) => {
                    id_list += String(get_id.rows[0]['product_id']) + ",";
                    console.log(get_id.rows[0]['product_id']);
                    console.log("in loop", id_list);
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
                console.log(max_id);
            });
            resolve();
        });
    }
    get_max_id();
    await new Promise(resolve => setTimeout(resolve, 1500));
    //max_id = String(max_id + 1);
    total_price = String(total_price);
    console.log(date_string);
    console.log(id_list);
    console.log(quant_list);
    console.log(total_price);
    console.log("max_id", max_id);
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


    // return new Promise (function(resolve, reject){
        
    //     //"INSERT INTO orders(id, order_num, product_ids, in_progress, is_completed, total_price, date) VALUES(" + Main.order_id + ", " + Main.order_num + ", '" + id_list + "', FALSE, TRUE, " + total_price + ", '" + date + " " + time + "');"
        
    //     //remove last comma
    //     //id_list = id_list.slice(0, -1);
        
        
    //     pool.connect();
    //     pool.query('SELECT * FROM product', (error, results) => {
    //     if (error) {
    //         console.log("bad");
    //         reject(error)
    //     }
    //     resolve(results.rows);
    //     console.log(results.rows[0]['description']);
    //     })
    // })
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

const getIngredient = () => {
    return new Promise(function(resolve, reject) {
        // console.log("getProduct");
        const {Client, Pool} = require('pg');
        const pool = new Pool({
        user: 'csce315_903_juntunen',
        host: 'csce-315-db.engr.tamu.edu',
        database: 'csce315_903_13',
        password: '630007600',
        port: 5432,
        ssl: {rejectUnauthorized: false}
        });
        pool.connect();
        // const result = pool.query('SELECT * FROM product;')
        // console.log(result);
        // console.log("got Product");
        pool.query('SELECT * FROM Ingredient', (error, results) => {
        if (error) {
            console.log("bad");
            reject(error)
        }
        
        resolve(results.rows);
        console.log(results.rows[0]['description']);
        })
        console.log("here");
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

    console.log('target language is ' + targetLanguage);
    console.log('text is ' + text);

    try {
        let [response] = await translate.translate(text, targetLanguage);
        console.log('translation is successful');
        res.status(200).json(response);
    } catch (error) {
        console.log('translation failed');
        res.status(500).json(error);
    }
}

module.exports = {
    getProduct,
    addOrder,
    getOrders,
    getIngredient,
    translateText
}