const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 8

const userSchema = new Schema(
  {
    login: {
      type: String,
      required: [true, 'Login is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },
    role: {
      type: String,
      default: 'super_admin',
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = model('user', userSchema)
