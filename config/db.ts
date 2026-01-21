import mongoose from "mongoose";

const DEFAULT_RETRY_DELAY_MS = 5_000;
const MAX_RETRY_DELAY_MS = 60_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (): Promise<void> => {
    const mongoUri = (process.env.MONGO_URI ?? "").trim();
    if (!mongoUri) {
        console.warn("MONGO_URI is not set; skipping MongoDB connection.");
        return;
    }

    let attempt = 0;
    let delayMs = DEFAULT_RETRY_DELAY_MS;

    // Keep retrying so the server can stay up and auto-recover.
    // This is especially useful for MongoDB Atlas when the server IP needs whitelisting.
    // If you prefer fail-fast behavior, switch back to process.exit(1).
    // eslint-disable-next-line no-constant-condition
    while (true) {
        attempt += 1;
        try {
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 10_000,
            });

            console.log("MongoDB connected");
            return;
        } catch (err: any) {
            const message = err?.message ?? String(err);
            console.error(
                `MongoDB connection error (attempt ${attempt}): ${message}. Retrying in ${delayMs}ms...`
            );

            await sleep(delayMs);
            delayMs = Math.min(Math.round(delayMs * 1.5), MAX_RETRY_DELAY_MS);
        }
    }
};

export default connectDB;
