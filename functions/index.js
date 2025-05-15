const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Reference to your Cloud Storage bucket
const bucket = admin.storage().bucket("xrp-token-images"); // Ensure this matches your actual bucket

/**
 * Function to fetch and serve token metadata JSON
 * URL format: https://nexabit.xyz/{symbol}_metadata.json
 */
exports.getMetadata = functions.https.onRequest(async (req, res) => {
    try {
        // Extract the token symbol from the URL path
        const symbol = req.path.replace("/", "").replace("_metadata.json", "").toLowerCase();
        const fileName = `${symbol}_metadata.json`;
        const file = bucket.file(fileName);

        // Check if the file exists
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).json({ error: "Metadata not found" });
        }

        // Fetch the file contents
        const [content] = await file.download();

        // Set response headers and send metadata
        res.setHeader("Content-Type", "application/json");
        res.send(content);

    } catch (error) {
        console.error("Error fetching metadata:", error);
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * Function to fetch and serve the XRPL ledger TOML file
 * URL format: https://nexabit.xyz/.well-known/xrp-ledger.toml
 */
exports.getTomlFile = functions.https.onRequest(async (req, res) => {
    try {
        const file = bucket.file(".well-known/xrp-ledger.toml");

        // Check if the TOML file exists
        const [exists] = await file.exists();
        if (!exists) {
            return res.status(404).send("TOML file not found.");
        }

        // Fetch the file contents
        const [content] = await file.download();

        // Set response headers and send TOML content
        res.setHeader("Content-Type", "text/plain");
        res.send(content.toString());

    } catch (error) {
        console.error("Error fetching TOML file:", error);
        res.status(500).send("Server error");
    }
});
