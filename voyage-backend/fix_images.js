// Check which packages still have missing images, download for those that need it
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const https = require("https");
require("dotenv").config();

const Package = require("./models/Package");
const uploadsDir = path.join(__dirname, "uploads");

function download(url, filepath) {
    return new Promise((resolve, reject) => {
        const go = (u, n = 0) => {
            if (n > 10) return reject(new Error("Too many redirects"));
            const m = u.startsWith("https") ? https : require("http");
            m.get(u, { timeout: 15000 }, r => {
                if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location)
                    return go(r.headers.location, n + 1);
                if (r.statusCode !== 200) return reject(new Error("HTTP " + r.statusCode));
                const w = fs.createWriteStream(filepath);
                r.pipe(w);
                w.on("finish", () => { w.close(); resolve(); });
                w.on("error", reject);
            }).on("error", reject);
        };
        go(url);
    });
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected\n");

    const pkgs = await Package.find({}).sort({ createdAt: -1 });
    const missing = [];

    for (const p of pkgs) {
        const fp = p.image ? path.join(__dirname, p.image) : null;
        const ok = fp && fs.existsSync(fp);
        console.log(`${ok ? "OK " : "BAD"} | ${p.name} | ${p.image}`);
        if (!ok) missing.push(p);
    }

    console.log(`\n${missing.length} packages need images.\n`);

    if (missing.length === 0) {
        await mongoose.disconnect();
        return;
    }

    // Download unique images using picsum with different IDs
    const picsumIds = [10, 15, 20, 28, 29, 36, 37, 39, 42, 48, 49, 50, 54, 57, 58];

    for (let i = 0; i < missing.length; i++) {
        const pkg = missing[i];
        const pid = picsumIds[i % picsumIds.length];
        const url = `https://picsum.photos/id/${pid}/800/500`;
        const filename = `package-${Date.now()}-${i}.jpg`;
        const filepath = path.join(uploadsDir, filename);

        console.log(`Downloading for: ${pkg.name} (picsum id=${pid})...`);
        try {
            await download(url, filepath);
            pkg.image = `uploads/${filename}`;
            await pkg.save();
            console.log(`  -> Saved as ${filename} (${(fs.statSync(filepath).size / 1024).toFixed(0)}KB)`);
            await new Promise(r => setTimeout(r, 800));
        } catch (e) {
            console.log(`  -> FAILED: ${e.message}`);
        }
    }

    console.log("\nDone!");
    await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
