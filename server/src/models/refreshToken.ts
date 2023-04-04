import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    createdByIp: String,
    revoked: Date,
    revokedByIp: String,
    replacedByToken: String
},
{
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

export default mongoose.model('refreshToken', schema);
