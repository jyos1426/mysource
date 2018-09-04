import models from '../../models'
const crypto = require ('crypto')
const jwt = require('jsonwebtoken')

export async function getByEmail(parentValue, {email}) {
  return await models.User.findOne({where: {email}})
}

export async function getAll() {
  return await models.User.findAll()
}

export async function signup(parentValue, {id, email, password}) {
  const user = await models.User.create({
    email,
    password: crypto.createHash('sha1').update(password).digest('base64')
  })

  // return json web token
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export async function signin (parentValue, { email, password }) {
  const user = await models.User.findOne({ where: { email } })
  let cryptoPassword =  crypto.createHash('sha1').update(password).digest('base64');
  if (!user) {
    throw new Error('No user with that email')
  }

  const valid = user.password == cryptoPassword;

  if (!valid) {
    throw new Error('Incorrect password')
  }

  // return json web token
  return await jwt.sign(
    { id: user.id, email: user.email },
    'secret',
    { expiresIn: '1h' }
  )
}

export async function remove(parentValue, {id}) {
  return await models.Thought.destroy({where: {id}})
}