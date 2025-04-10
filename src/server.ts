
import app from './app';
import { connectDB } from './configs/database';
import config from "./configs/config";

const PORT = config.server.port || 9000;

// Connect to database
const start = async () => {
  try {
    connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
};

start();
