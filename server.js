const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.static(__dirname));
app.use(express.json()); // needed to read POST body

// ─────────────────────────────────
// EMAIL TRANSPORTER SETUP
// (replace with your real credentials)
// ─────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your_email@gmail.com",
        pass: "your_app_password"  // use Gmail App Password, not your real password
    }
});

// ─────────────────────────────────
// REGISTER ROUTE
// ─────────────────────────────────
app.post("/register", async (req, res) => {

    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        await transporter.sendMail({
            from: "your_email@gmail.com",
            to: email,
            subject: "Welcome to Forex Lab 🎯",
            html: `
                <h2>Welcome, ${username}!</h2>
                <p>Thank you for joining <strong>Forex Lab</strong>.</p>
                <p>You now have access to premium trading strategies, psychology guides, and entry models.</p>
                <br>
                <p>Start learning: <a href="http://your-site.com/dashboard.html">Go to Dashboard</a></p>
            `
        });

        res.json({ success: true, message: "Welcome email sent!" });

    } catch (err) {
        console.error("Email error:", err);
        res.status(500).json({ error: "Failed to send email" });
    }

});

app.listen(3000, () => {
    console.log("✅ Forex Lab server running on http://localhost:3000");
});