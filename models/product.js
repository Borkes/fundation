'use strict'
const Bluebird = require('bluebird');
const db = Bluebird.promisify(DB.query.bind(DB))

/**
 * 通过class_id和sub_class_id来获取产品列表
 * @param {num} class_id 
 * @param {num} sub_class_id 
 */
function getProduct(class_id, sub_class_id) {
    let sqlStr = 'SELECT a.item_name a.item_company_ID a.item_class_ID a.item_product_factor b.attribute_ID c.class_name d.compayn_name d.company_logo e.subclass_name FROM ' +
        ' fw_prd_items a, fw_prd_item_attribute b, fw_prd_class c, fw_company d WHERE a.item_ID = b.item_ID AND a.item_class_ID = c.class_ID AND a.item_compayn_ID ' +
        ' = d.company_ID AND e.subclass_ID = a.item_subclass_ID AND a.item_class_ID = ? AND a.item_subclass_ID = ?';
    return db(sqlStr, [class_id, sub_class_id]);
}

/**
 * 只通过class_id来获取产品列表
 * @param {num} class_id 
 */
function getProductById(class_id) {
    //fw_prd_items a, fw_prd_item_attribute b, fw_prd_class c, fw_company d
    let sqlStr = 'SELECT a.item_name a.item_company_ID a.item_class_ID a.item_product_factor b.attribute_ID c.class_name d.compayn_name d.company_logo FROM ' +
        ' fw_prd_items a, fw_prd_item_attribute b, fw_prd_class c, fw_company d WHERE a.item_ID = b.item_ID AND a.item_class_ID = c.class_ID AND a.item_compayn_ID ' +
        ' = d.company_ID AND a.item_class_ID = ?';
    return db(sqlStr, [class_id]);
}

module.exports = {
    getProduct,
    getProductById,
}