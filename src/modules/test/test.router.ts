import { Router } from 'express'
import { User } from '../user/user.model'
import { Payment } from '../payment/payment.model'
import { Order, OrderAction } from '../order/order.model'
import { Gift } from '../gift/gift.model'

const testRouter = Router()

testRouter.get(
  '/test',
  async (req, res) => {
    const users = await User.find()
    const payments = await Payment.find()
    const orders = await Order.find()
    const orderActions = await OrderAction.find()
    const gifts = await Gift.find()

    res.send({
      users,
      payments,
      orders,
      orderActions,
      gifts
    })
  }
)

export { testRouter }
