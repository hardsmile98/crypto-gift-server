import { type IUser, type IGift } from '../index'

export enum OrderActions {
  purchase = 'purchase',
  send = 'send',
  receive = 'receive'
}
export interface IOrderAction {
  _id: string
  userId: string
  action: OrderActions
  associatedOrderId: string
}

export enum OrderStatuses {
  purchased = 'purchased',
  sent = 'sent'
}

export interface IOrder {
  _id: string
  hash: string
  userId: string
  giftId: string
  status: OrderStatuses
  purchaseDate: number
  paymentId: string
  sendDate: number
  recipientId: string
}

export interface IExtendOrder extends Omit<IOrder, 'userId' | 'giftId' | 'recipientId'> {
  userId: IUser
  giftId: IGift
  recipientId: IUser
}

export interface IExtendActionHistory extends Omit<IOrderAction, 'associatedOrderId'> {
  associatedOrderId: string | IExtendOrder
};
