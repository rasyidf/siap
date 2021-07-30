const express = require('express')
const path = require("path");
const consola = require('consola')
const attendanceRouter = express.Router()
const sqlite3 = require("sqlite3").verbose();

const rootFolder = path.join(__dirname, '../../')
const dataFolder = path.join(rootFolder, 'data')
const db_name = path.join(dataFolder, "apptest.db");
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        return consola.error({
            message: err.message + ' ' + err.code + ' ' + db_name,
            badge: true
        });
    }
    consola.ready({
        message: "Successful connection to the database 'apptest.db'",
        badge: true
    });
});

attendanceRouter.get("/all", (req, res) => {
    const sql = "SELECT * FROM attendance ORDER BY createdAt"
    db.all(sql, [], (err, rows) => {
        if (err) {
            return consola.error({ message: err.message });
        }
        res.send(rows);
    });
});
// POST /create
attendanceRouter.post("/create", (req, res) => {
    const sql = "INSERT INTO attendance ('status','createdAt','description','userId','userName') VALUES (?,?,NULL,?,?)";
    const att = [req.body.status, new Date().toDateString(), req.body.userId, req.body.userName];
    db.run(sql, att, err => {
        if (err) {
            consola.error({ message: err.message });
        } else {
            consola.success({ message: "Successfully created a new entry." });
            res.send({ message: "Successfully created a new entry.", statusCode: 200 });
        }
    });
});
// GET /delete/5
attendanceRouter.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM attendance WHERE id = ?";
    db.get(sql, id, (err, row) => {
        if (err) {
            consola.error({ message: err.message });
        } else {
            consola.success({ message: "Attendance removed successfully." });
            res.send({ message: "Attendance removed successfully.", model: row, statusCode: 200 });
        }
    });
});

module.exports = attendanceRouter