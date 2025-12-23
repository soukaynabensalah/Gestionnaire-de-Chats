const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config();

const app = express();

// Correction de process.env.PORT
const port = process.env.PORT || 5000;

// Enable trust proxy for Vercel/Railway/Heroku
// This allows req.secure to be true when behind a load balancer
app.set('trust proxy', 1);

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

// == MySQL ==
// Use environment variables for Railway deployment, fallback to localhost for local development
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "animals",
    port: process.env.MYSQL_PORT || 3306,
    // Add SSL for TiDB Cloud (and other cloud providers), but disable for localhost
    ssl: process.env.MYSQL_HOST && process.env.MYSQL_HOST !== 'localhost' ? {
        rejectUnauthorized: true
    } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// =======================
// Session Store (MySQL)
// =======================
const sessionStore = new MySQLStore({}, pool);

// =======================
// Middleware Session
// =======================
app.use(session({
    name: "cat_app_session",
    secret: process.env.SESSION_SECRET || "secret_long_et_complexe",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24h
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" // 'strict' peut bloquer parfois si redirection externe, lax est bon
    }
}));

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

// Add User
app.post("/users", async (req, res) => {
    const { name, email, pwd } = req.body;

    if (!name || !email || !pwd) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(pwd, saltRounds);

        pool.getConnection((err, connection) => {
            if (err) {
                console.error("DB connection error:", err);
                return res.status(500).json({ error: "DB connection error" });
            }

            const sql = "INSERT INTO users (name, email, pwd) VALUES (?, ?, ?)";
            connection.query(sql, [name, email, hashedPassword], (qErr, result) => {
                connection.release();

                if (qErr) {
                    console.error("Query error:", qErr);
                    return res.status(500).json({ error: "Query error" });
                }

                res.status(201).json({
                    message: "User added successfully",
                    userId: result.insertId
                });
            });
        });

    } catch (error) {
        console.error("Hash error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Login User
app.post("/login", async (req, res) => {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
        return res.status(400).json({ error: "Email and password required" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB connection error:", err);
            return res.status(500).json({ error: "Database connection error" });
        }

        connection.query("SELECT * FROM users WHERE email = ?", [email], async (qErr, rows) => {
            connection.release();

            if (qErr) {
                console.error("Query error:", qErr);
                return res.status(500).json({ error: "Query error" });
            }

            if (rows.length === 0) {
                return res.status(401).json({ error: "Incorrect email or password" });
            }

            const user = rows[0];

            try {
                const isPasswordValid = await bcrypt.compare(pwd, user.pwd);

                if (!isPasswordValid) {
                    return res.status(401).json({ error: "Incorrect email or password" });
                }
                // START SESSION
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };

                res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });

            } catch (error) {
                console.error("Bcrypt error:", error);
                res.status(500).json({ error: "Server error" });
            }
        });
    });
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Could not log out" });
        }
        res.clearCookie("cat_app_session");
        res.json({ message: "Logged out" });
    });
});

// Check Auth Status
app.get("/check-auth", (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});


// Listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
