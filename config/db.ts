import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB connected');
        
        // Drop the unique index on machineId if it exists
        try {
            const db = mongoose.connection.db;
            await db?.collection('challengesubmissions').dropIndex('machineId_1');
            console.log('Dropped unique index on machineId');
        } catch (indexErr: any) {
            // Index might not exist, which is fine
            if (indexErr.code !== 27) { // 27 = IndexNotFound
                console.log('Index already removed or does not exist');
            }
        }
    } catch (err: any) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

export default connectDB;
