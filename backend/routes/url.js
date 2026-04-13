import express from 'express'
import Url from '../models/Url.js'
import { nanoid } from 'nanoid'

const router = express.Router()

router.post('/shorten', async (req, res) => {
    try {
        const { originalUrl } = req.body;
        console.log(originalUrl);
        if (!originalUrl) {
            return res.status(500).json({ error: "URL is required" })
        }
        try {
            new URL(originalUrl);
        } catch (error) {
            return res.status(400).json({ error: "Invalid URL" })
        }
        // duplicate shortId avoid karne ke liye
        let shortId;
        let exists = true;
        while (exists) {
            shortId = nanoid(7);
            exists = await Url.findOne({ shortId })
        }

        const url = await Url.create({
            originalURL: originalUrl,
            shortURL: shortId
        });
        res.json({
            shortId: url.shortId,
            shortURL: `${process.env.BASE_URL}/${url.shortURL}`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Server Error' })
    }
})

router.get("/:shortId", async (req, res) => {
    try {
        const { shortId } = req.params;

        const url = await Url.findOne({  shortURL: shortId });
        if (!url)
            return res.status(404).json({ error: 'URL not found' })

        url.clicks += 1;
        await url.save();

        return res.redirect(url.originalURL);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'server error' })
    }
})
export default router;