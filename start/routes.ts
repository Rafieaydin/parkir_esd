/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import users_controller from '../app/controllers/users_controller.js'
import AuthController from '#controllers/auth_controller'
import { middleware } from './kernel.js'
import PostsController from '#controllers/posts_controller'
import AdminMiddleware from '#middleware/admin_middleware'
import TempatParkirsController from '#controllers/tempat_parkirs_controller'
import SectionTempatParkirsController from '#controllers/section_tempat_parkirs_controller'
import SlotSectionTempatParkirsController from '#controllers/slot_section_tempat_parkirs_controller'
import BookingsController from '#controllers/bookings_controller'

//router.get('/', [users_controller,'index'])

router.get('/email', async ({view}) => {
  return view.render('eemail_verification')
})

router.post('/login', [AuthController,'login'])
router.post('/register',[AuthController,'register'])
router.post('/forgot-password', [AuthController,'forgotPassword'])
router.post('/verify-phone', [AuthController,'verifyPhone'])
router.post('/reset-password', [AuthController,'resetPassword'])
router.post('/resend-code-email', [AuthController,'resendCodeEmail'])
router.post('/resend-code-phone', [AuthController,'resendCodePhone'])
//router.post('/change-password', [AuthController,'changePassword']).use(middleware.auth({guards:['api']}))
//router.post('/refresh-token', [AuthController,'refreshToken']).use(middleware.auth({guards:['api']}))

router.post('/logout', [AuthController,'logout']).use(middleware.auth({guards:['api']}))
router.get('/token', [AuthController,'token']).use(middleware.auth({guards: ['api'],}))

router.group(() => {
  router.get('/', [TempatParkirsController,'index']);
  router.get('find/:id', [TempatParkirsController,'show']);
  router.post('/', [TempatParkirsController,'store']);
  router.put(':id', [TempatParkirsController,'update']);
  router.delete(':id/delete', [TempatParkirsController,'destroy']);

  router.get('section', [SectionTempatParkirsController,'index']);
  router.get('section/find/:id', [SectionTempatParkirsController,'show']);
  router.post('section', [SectionTempatParkirsController,'store']);
  router.put('section/:id', [SectionTempatParkirsController,'update']);
  router.delete('section/:id/delete', [SectionTempatParkirsController,'destroy']);

  router.get('section/slot', [SlotSectionTempatParkirsController,'index']);
  router.get('section/slot/find/:id', [SlotSectionTempatParkirsController,'show']);
  router.post('section/slot', [SlotSectionTempatParkirsController,'store']);
  router.put('section/slot/:id', [SlotSectionTempatParkirsController,'update']);
  router.delete('section/slot/:id/delete', [SlotSectionTempatParkirsController,'destroy']);
}).prefix('tempat_parkir').use([middleware.auth({guards: ['api']}), middleware.admin()])

router.group(() => {
  router.get('/list/booking', [BookingsController,'list'])
  router.post('/booking', [BookingsController,'Booking'])
  router.post('/checkin', [BookingsController,'checkIn'])
  router.post('/checkout', [BookingsController,'checkOut'])
  //router.get('/history', [BookingsController,'History'])
}).use([middleware.auth({
  guards: ['api']
}), middleware.admin()]);

router.group(() => {
  router.get('/', [users_controller,'index'])
  router.get('/:id', [users_controller,'show'])
  router.post('/', [users_controller,'store'])
  router.put('/:id', [users_controller,'update'])
  router.delete('/:id', [users_controller,'destroy'])
}).prefix('/users').use([middleware.auth({
  guards: ['api']
}), middleware.admin()]);

router.group(() => {
  router.get('/', [PostsController,'index'])
  router.get('/:id', [PostsController,'show'])
  router.post('/', [PostsController,'store'])
  router.put('/:id', [PostsController,'update'])
  router.delete('/:id', [PostsController,'destroy'])
}).prefix('/todos').use(middleware.auth({
  guards: ['api']
}))

