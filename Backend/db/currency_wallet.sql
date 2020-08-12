/*
 Navicat Premium Data Transfer

 Source Server         : mongoDB
 Source Server Type    : MongoDB
 Source Server Version : 40006
 Source Host           : localhost:27017
 Source Schema         : currency_wallet

 Target Server Type    : MongoDB
 Target Server Version : 40006
 File Encoding         : 65001

 Date: 10/07/2019 03:32:24
*/


// ----------------------------
// Collection structure for metas
// ----------------------------
db.getCollection("metas").drop();
db.createCollection("metas");

// ----------------------------
// Documents of metas
// ----------------------------
db.getCollection("metas").insert([ {
    _id: ObjectId("5d24f938ace1ef811428dffa"),
    key: "default_wallet",
    value: {
        privateKey: "cR6oJ3C98tgiNGbAM6ykJ9QjkPgtKzMYJXJV9aezctXGXi4DDGPp",
        address: "miHyowCgQxbVS3mdwFecTxEq9qk1R7EYPH"
    },
    __v: NumberInt("0")
} ]);
db.getCollection("metas").insert([ {
    _id: ObjectId("5d24f93cace1ef811428dffc"),
    key: "lcprice",
    value: "0.00000001",
    __v: NumberInt("0")
} ]);
db.getCollection("metas").insert([ {
    _id: ObjectId("5d24f938ace1ef811428dffb"),
    key: "admin_login",
    value: {
        email: "admin@admin.com",
        password: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
    },
    __v: NumberInt("0")
} ]);
db.getCollection("metas").insert([ {
    _id: ObjectId("5d24f9b70bacdb9b288cba39"),
    key: "ASmultiplier",
    value: NumberInt("0"),
    __v: NumberInt("0")
} ]);
db.getCollection("metas").insert([ {
    _id: ObjectId("5d24f9b70bacdb9b288cba3a"),
    key: "CFmultiplier",
    value: NumberInt("0"),
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for orders
// ----------------------------
db.getCollection("orders").drop();
db.createCollection("orders");
db.getCollection("orders").createIndex({
    orderid: NumberInt("1")
}, {
    name: "orderid_1",
    background: true,
    unique: true
});

// ----------------------------
// Collection structure for users
// ----------------------------
db.getCollection("users").drop();
db.createCollection("users");
db.getCollection("users").createIndex({
    userid: NumberInt("1")
}, {
    name: "userid_1",
    background: true,
    unique: true
});
