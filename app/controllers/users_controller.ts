import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {

  public async index({  response }: HttpContext) {
    return response.status(200).json({ message: {
      status: 'succes',
      data: await User.all()
    }})
  }

  public async show({ response }: HttpContext) {
    return response.status(200).json({ message: 'Hello World' })
  }

  public async store({ request, response }: HttpContext) {

    const { fullname, email, password,role, gender, dateOfBirth,phone } = request.all()
    await request.validateUsing(createUserValidator)

    const user = await User.findBy('email', email)
    if (user) {
      return response.status(400).json({ message: {
        status: 'error',
        message: 'Email already exists'
      }})
    }
    const mewUser = await User.create({ fullName:fullname, email:email, password:password, role:role, phone:phone, dateOfBirth:dateOfBirth, gender:gender })
    return response.status(200).json({ message: {
      status: 'success',
      data: mewUser
    }})
  }

  public async update({ request, response }: HttpContext) {
    const {fullName, email, password,role, gender, dateOfBirth,phone } = request.all() // buat dapetin request body
    await request.validateUsing(createUserValidator) // buat validasi
    const user = await User.find(request.params().id) // buat mencari id seperti di framework lainya
    if (!user) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'User not found'
      }})
    }
    await  user.merge({
      fullName: fullName,
      email: email,
      password: password,
      role: role,
      phone:phone,
      dateOfBirth:dateOfBirth,
      gender:gender
    })
    await user.save()

    return response.status(200).json({
      status: 'success',
      data: user
    })
  }

  public async destroy({ request, response }: HttpContext) {
    const user = await User.findBy('id', request.params().id)
    if (!user) {
      return response.status(404).json({ message: {
        status: 'error',
        message: 'User not found'
      }})
    }
    await user.delete()
    return response.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    })
  }

}
