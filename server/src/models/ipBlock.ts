import mongoose from 'mongoose'

const Schema = mongoose.Schema

export interface iIpBlockSchema {
  _id: string
  ip: string
  blockedUntil?: Date
  createdAt: Date
  updatedAt: Date
}

const IpBlockSchema = new Schema<iIpBlockSchema>(
  {
    ip: {
      type: String,
      unique: true,
      required: true,
    },
    blockedUntil: {
      type: Date,
      required: false,
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
