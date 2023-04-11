import mongoose from 'mongoose'

const Schema = mongoose.Schema

export interface iUser {
  name?: string
  email?: string
  newsletter?: boolean
  transfercode: string
  password?: string
  cards?: {
    creationDate: Date
    stamps: {
      creationDate: Date
    }[]
  }[]
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<iUser>(
  {
    name: {
      type: String,
      default: '',
      required: false,
    },
    email: {
      type: String,
      default: '',
      required: false,
    },
    newsletter: {
      type: Boolean,
      default: false,
      required: false,
    },
    transfercode: {
      type: String,
      default: false,
      required: true,
    },
    password: {
      type: String,
      default: false,
      required: false,
    },
    cards: [
      {
        creationDate: {
          type: Date,
          default: Date.now,
          required: true,
        },
        stamps: [
          {
            creationDate: {
              type: Date,
              default: Date.now,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

export default mongoose.model('user', UserSchema)
