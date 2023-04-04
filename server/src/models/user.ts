import mongoose from 'mongoose'

const Schema = mongoose.Schema
const UserSchema = new Schema(
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
