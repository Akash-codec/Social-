import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminReply extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  admin: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  isOfficial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminReplySchema = new Schema<IAdminReply>(
  {
    content: {
      type: String,
      required: [true, 'Admin reply content is required'],
      trim: true,
      maxlength: [2000, 'Admin reply cannot exceed 2000 characters'],
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    isOfficial: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAdminReply>('AdminReply', adminReplySchema);
