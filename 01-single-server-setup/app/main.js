const map = new Map()
const express = require('express')
const PORT = 8000;
const app = express();
const pool = require("./db")
const hash = require("murmurhash")
app.use(express.json())
app.post("/shorten",async (req,res)=>{
    const shortURL = hash.v3(req.body.url)
    if (!(req.body.url)) return res.json({"error":"no url found"})
        if (! (req.body.url.startsWith("http://"))) {
            req.body.url = "http://"+req.body.url
        }
     try {
        await pool.query(
            `INSERT INTO urls (short_code, original_url)
             VALUES ($1, $2)`,
            [shortURL, req.body.url]
        );

        return res.json({
            url: shortURL
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "failed to shorten URL"
        });
    }
})
app.get("/:url", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT original_url
             FROM urls
             WHERE short_code = $1`,
            [req.params.url]
        );
        const url = result.rows[0]?.original_url;

        if (!url) {
            return res.status(404).json({
                error: "URL not found"
            });
        }

        return res.redirect(url);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: "Database error"
        });
    }
});
app.listen(PORT,()=>{
    console.log("app listening on the ",PORT)
})