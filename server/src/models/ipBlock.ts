import mongoose from 'mongoose'

const Schema = mongoose.Schema

export interface iUser {
  _id: string
  ip: string
  blockedUntil: Date
  createdAt: Date
  updatedAt: Date
}

const IpBlockSchema = new Schema<iUser>(
  {
    ip: {
      type: String,
      unique: true,
      required: true,
    },
    blockedUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

export default mongoose.model('ipBlock', IpBlockSchema)
