import mongoose from 'mongoose'

const Schema = mongoose.Schema

export interface iCard {
  creationDate: Date
  blockedUntil: Date
  honouredAt?: Date
  stamps: {
    creationDate: Date
    validUntilDate?: Date
  }[]
}

export interface iUser {
  _id: string
  name?: string
  email?: string
  newsletter?: boolean
  transfercode: string
  password?: string
  passwordResetToken?: string
  passwordChangedAt?: Date
  cards?: iCard[]
  userRoles: string[]
  createdAt: Date
  updatedAt: Date
}
export interface iNewUser {
  name?: string
  email?: string
  newsletter: boolean
  password?: string
}

export interface iUpdateUser {
  name: string
  email: string
  newsletter: boolean
  password?: string
  passwordResetToken?: string
  passwordChangedAt?: Date
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
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    passwordResetToken: {
      type: String,
      required: false,
    },
    passwordChangedAt: {
      type: Date,
      required: false,
    },
    cards: [
      {
        creationDate: {
          type: Date,
          default: Date.now,
          required: true,
        },
        blockedUntil: {
          type: Date,
          default: Date.now,
          required: true,
        },
        honouredAt: {
          type: Date,
          default: null,
          required: false,
        },
        stamps: [
          {
            creationDate: {
              type: Date,
              default: Date.now,
              required: true,
            },
            validUntilDate: {
              type: Date,
              required: false,
            },
          },
        ],
      },
    ],
    userRoles: {
        type: [String],
        default: [],
        required: true,
      }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
)

export default mongoose.model('user', UserSchema)
