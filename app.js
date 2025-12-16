const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

// Correction de process.env.PORT
const port = process.env.PORT || 5000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"))

// == MySQL ==
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "db1_express"
});

// Get cats
app.get("/cats", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "DB connection error" })
        }
        connection.query("SELECT * FROM cats", (qErr, rows) => {
            connection.release();
            if (qErr) {
                console.error("Query error:", qErr);
                return res.status(500).json({ error: "Query error" });
            }
            res.json(rows)
        })
    })
});

// Get cats By id
app.get("/cats/:id", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "DB connection error" })
        }
        connection.query("SELECT * FROM cats WHERE id = ?", [req.params.id], (qErr, rows) => {
            connection.release();
            if (qErr) {
                console.error("Query error:", qErr);
                return res.status(500).json({ error: "Query error" });
            }
            res.json(rows)
        })
    })
});

// Get cats By id
app.delete("/cats/:id", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "DB connection error" })
        }
        connection.query("DELETE FROM cats WHERE id = ?", [req.params.id], (qErr, rows) => {
            connection.release();
            if (qErr) {
                console.error("Query error:", qErr);
                return res.status(500).json({ error: "Query error" });
            }
            res.json({ Message: `Record Num : ${req.params.id} deleted successfully` })
        })
    })
});

// Add cat
app.post("/cats", (req, res) => {
    const { name, tag, description, img } = req.body
    // Use default image if no image is provided
    const catImage = img || "catDefault.jpeg";

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "DB connection error" })
        }
        connection.query("INSERT INTO cats (name, tag, description, img) VALUES (?, ?, ?, ?)", [name, tag, description, catImage], (qErr, rows) => {
            connection.release();
            if (qErr) {
                console.error("Query error:", qErr);
                return res.status(500).json({ error: "Query error" });
            }
            res.json(rows)
        })
    })
});

// Update cat
app.put("/cats/:id", (req, res) => {
    const { name, tag, description } = req.body
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "DB connection error" })
        }
        connection.query("UPDATE cats SET name = ?, tag = ?, description = ? WHERE id = ?", [name, tag, description, req.params.id], (qErr, rows) => {
            connection.release();
            if (qErr) {
                console.error("Query error:", qErr);
                return res.status(500).json({ error: "Query error" });
            }
            res.json({ Message: `Record Num : ${req.params.id} updated successfully` })
        })
    })
});

// Update cat
app.patch("/cats/:id", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "DB connection error" })
        }
        connection.query("UPDATE cats SET name = ? WHERE id = ?", [req.body.name, req.params.id], (qErr, rows) => {
            connection.release();
            if (qErr) {
                console.error("Query error:", qErr);
                return res.status(500).json({ error: "Query error" });
            }
            res.json({ Message: `Record Num : ${req.params.id} updated successfully` })
        })
    })
});

// Get tags
app.get("/tags", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "DB connection error" })
        }
        connection.query("SELECT DISTINCT tag FROM cats", (qErr, rows) => {
            connection.release();
            if (qErr) {
                console.error("Query error:", qErr);
                return res.status(500).json({ error: "Query error" });
            }
            res.json(rows)
        })
    })
});

// Listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
