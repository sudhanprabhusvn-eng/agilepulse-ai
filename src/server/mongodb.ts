import mongoose, { Schema, Document } from 'mongoose';

// User Interface & Schema
export interface IUser extends Document {
  id?: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  organization?: string;
  jobTitle?: string;
  status: string;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'Developer' },
  organization: { type: String, default: 'AgilePulse Inc.' },
  jobTitle: { type: String, default: 'Software Engineer' },
  status: { type: String, default: 'Active' },
  emailVerified: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Report Interface & Schema
export interface IReport extends Document {
  reportId: string;
  title: string;
  type: string;
  createdBy: string;
  isScheduled: boolean;
  scheduleFrequency?: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reportId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, default: 'sprint' },
  createdBy: { type: String, default: 'System Admin' },
  isScheduled: { type: Boolean, default: false },
  scheduleFrequency: { type: String, default: 'weekly' },
  createdAt: { type: Date, default: Date.now },
});

// Notification Interface & Schema
export interface INotification extends Document {
  notifId: string;
  title: string;
  message: string;
  type: string;
  category: string;
  priority: string;
  timestamp: string;
  read: boolean;
}

const NotificationSchema = new Schema<INotification>({
  notifId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'system' },
  category: { type: String, default: 'system' },
  priority: { type: String, default: 'medium' },
  timestamp: { type: String, required: true },
  read: { type: Boolean, default: false },
});

// Task Interface & Schema
export interface ITask extends Document {
  taskId: string;
  title: string;
  status: string;
  priority: string;
  storyPoints: number;
  assigneeName?: string;
  sprintName?: string;
  blocked: boolean;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  status: { type: String, default: 'todo' },
  priority: { type: String, default: 'medium' },
  storyPoints: { type: Number, default: 3 },
  assigneeName: { type: String, default: 'Unassigned' },
  sprintName: { type: String, default: 'Sprint 24' },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Mongoose Models
export const UserModel: mongoose.Model<IUser> = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export const ReportModel: mongoose.Model<IReport> = (mongoose.models.Report as mongoose.Model<IReport>) || mongoose.model<IReport>('Report', ReportSchema);
export const NotificationModel: mongoose.Model<INotification> = (mongoose.models.Notification as mongoose.Model<INotification>) || mongoose.model<INotification>('Notification', NotificationSchema);
export const TaskModel: mongoose.Model<ITask> = (mongoose.models.Task as mongoose.Model<ITask>) || mongoose.model<ITask>('Task', TaskSchema);

// Connection Helper
let isConnected = false;

const DEFAULT_MONGODB_URI = 'mongodb+srv://sudhanprabhusvn_db_user:v0OtfAMgrQG8xRnT@cluster0.smyezhg.mongodb.net/agilepulse?retryWrites=true&w=majority&appName=Cluster0';

export async function connectMongoDB() {
  const uri = (process.env.MONGODB_URI || DEFAULT_MONGODB_URI).trim();
  console.log("MONGODB_URI loaded:", !!process.env.MONGODB_URI);
console.log("Using URI:", uri);

  if (!uri) {
    return {
      connected: false,
      message: 'MONGODB_URI is not set. The application is running seamlessly using the built-in in-memory state engine.',
    };
  }

  if (uri.includes('<username>') || uri.includes('<password>')) {
    return {
      connected: false,
      message: 'MONGODB_URI contains placeholder brackets (<username> / <password>). Please replace them with your actual MongoDB Atlas database credentials in Settings.',
    };
  }

  if (uri.includes('127.0.0.1') || uri.includes('localhost')) {
    return {
      connected: false,
      message: 'Local MongoDB (127.0.0.1:27017) is not running in this cloud sandbox environment. Please provide a MongoDB Atlas cloud URI (e.g. mongodb+srv://...).',
    };
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return { connected: true, message: 'MongoDB already connected.', host: mongoose.connection.host };
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Successfully connected to MongoDB cluster: ${conn.connection.host}`);
    return { connected: true, message: 'Successfully connected to MongoDB.', host: conn.connection.host };
  } catch (err: any) {
    console.warn('[MongoDB] Connection notice:', err.message);
    return { connected: false, message: `MongoDB connection error: ${err.message}` };
  }
}

export function getMongoDBStatus() {
  const readyState = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const uri = (process.env.MONGODB_URI || DEFAULT_MONGODB_URI).trim();
  const isPlaceholder = uri.includes('<username>') || uri.includes('<password>');
  const isLocalhost = uri.includes('127.0.0.1') || uri.includes('localhost');

  return {
    configured: Boolean(uri) && !isPlaceholder && !isLocalhost,
    readyState: readyState,
    status: states[readyState] || 'unknown',
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
    isPlaceholder,
    isLocalhost,
  };
}
