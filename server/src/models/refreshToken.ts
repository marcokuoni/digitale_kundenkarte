import mongoose from 'mongoose'
import { iUser } from './user'

const Schema = mongoose.Schema

export interface iRefreshToken {
  user: iUser
  token: string
  expires: Date
  created: Date
  createdByIp: string
  revoked: Date
  revokedByIp: string
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
