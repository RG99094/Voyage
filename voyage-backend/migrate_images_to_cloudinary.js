// migrate_images_to_cloudinary.js
// One-time script: Uploads all existing local images to Cloudinary and updates DB records

require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Import Models
const Package = require("./models/Package");
const TeamMember = require("./models/TeamMember");
const Client = require("./models/Client");
const Request = require("./models/Request");

const UPLOADS_DIR = path.join(__dirname, "uploads");

/**
 * Upload a local file to Cloudinary
 * @param {string} localPath - Relative path like "uploads/package-123.jpg"
 * @param {string} folder - Cloudinary folder like "voyage/packages"
 * @returns {string|null} Cloudinary URL or null if failed
 */
async function uploadToCloudinary(localPath, folder) {
    // Build absolute path
    const absolutePath = path.join(__dirname, localPath);

    if (!fs.existsSync(absolutePath)) {
        console.warn(`  ⚠️ File not found: ${absolutePath}`);
        return null;
    }

    try {
        const result = await cloudinary.uploader.upload(absolutePath, {
            folder,
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (err) {
        console.error(`  ❌ Upload failed for ${localPath}:`, err.message);
        return null;
    }
}

async function migrateCollection(Model, modelName, imageField, cloudinaryFolder) {
    console.log(`\n📦 Migrating ${modelName}...`);
    const docs = await Model.find({});
    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const doc of docs) {
        const currentPath = doc[imageField];

        // Skip if no image, already a Cloudinary URL, or empty
        if (!currentPath) {
            skipped++;
            continue;
        }
        if (currentPath.startsWith("http")) {
            console.log(`  ⏭️ Already cloud URL: ${doc._id}`);
            skipped++;
            continue;
        }

        console.log(`  📤 Uploading: ${currentPath}`);
        const cloudinaryUrl = await uploadToCloudinary(currentPath, cloudinaryFolder);

        if (cloudinaryUrl) {
            doc[imageField] = cloudinaryUrl;
            await doc.save();
            console.log(`  ✅ ${doc._id} → ${cloudinaryUrl}`);
            migrated++;
        } else {
            failed++;
        }
    }

    console.log(`  📊 ${modelName}: ${migrated} migrated, ${skipped} skipped, ${failed} failed (${docs.length} total)`);
}

async function migrateRequests() {
    console.log(`\n📦 Migrating Requests (documents)...`);
    const docs = await Request.find({});
    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const doc of docs) {
        const currentPath = doc.documentPath;

        if (!currentPath) {
            skipped++;
            continue;
        }
        if (currentPath.startsWith("http")) {
            console.log(`  ⏭️ Already cloud URL: ${doc._id}`);
            skipped++;
            continue;
        }

        console.log(`  📤 Uploading: ${currentPath}`);
        const cloudinaryUrl = await uploadToCloudinary(currentPath, "voyage/documents");

        if (cloudinaryUrl) {
            // Use updateOne to bypass Mongoose validation on old records
            await Request.updateOne({ _id: doc._id }, { $set: { documentPath: cloudinaryUrl } });
            console.log(`  ✅ ${doc._id} → ${cloudinaryUrl}`);
            migrated++;
        } else {
            failed++;
        }
    }

    console.log(`  📊 Requests: ${migrated} migrated, ${skipped} skipped, ${failed} failed (${docs.length} total)`);
}

async function main() {
    console.log("🚀 Starting Image Migration to Cloudinary...\n");
    console.log(`☁️ Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`📁 Uploads Dir: ${UPLOADS_DIR}`);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Migrate each collection
    await migrateCollection(Package, "Packages", "image", "voyage/packages");
    await migrateCollection(TeamMember, "TeamMembers", "image", "voyage/team");
    await migrateCollection(Client, "Clients (profile images)", "profileImage", "voyage/profiles");
    await migrateRequests();

    console.log("\n🎉 Migration complete!");
    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
