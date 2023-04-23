import mongoose from 'mongoose'
import { iUser } from './user'

const Schema = mongoose.Schema

export interface iRefreshToken {
  _id: string
  user: iUser
  token: string
  expires: Date
  created: Date
  createdByIp: string
  createdByUserAgent: string
  revoked: Date
  revokedByIp: string
  revokedByUserAgent: string
  replacedByToken: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<iRefreshToken>({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    createdByIp: String,
    createdByUserAgent: String,
    revoked: Date,
    revokedByIp: String,
    revokedByUserAgent: String,
    replacedByToken: String
},
{
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

export default mongoose.model('refreshToken', schema);
