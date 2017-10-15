// @flow
// https://github.com/tc39/proposal-observable
import $$observable from 'symbol-observable'

declare module 'rxact' {
  declare export interface ISubscriptionObserver {
    // Sends the next value in the sequence
    next(value: any): void,

    // Sends the sequence error
    error(errorValue: Error): void,

    // Sends the completion notification
    complete(): void,

    // A boolean value indicating whether the subscription is closed
    +closed: Boolean,
  }

  declare export interface IObserver {
    // Receives the subscription object when `subscribe` is called
    start(subscription: ISubscription): void,

    // Receives the next value in the sequence
    next(value: any): void,

    // Receives the sequence error
    error(errorValue: Error): void,

    // Receives a completion notification
    complete(): void,
  }

  declare export type SubscriberFunction =
    ISubscriptionObserver => (void => void) | ISubscription

  declare export interface ISubscription {
    // Cancels the subscription
    unsubscribe(): void,

    // A boolean value indicating whether the subscription is closed
    +closed?: Boolean,
  }

  declare export interface IESObservable {
    constructor(subscriber: SubscriberFunction): void,

    // Subscribes to the sequence with an observer
    subscribe(observer?: IObserver): ISubscription,

    // Subscribes to the sequence with callbacks
    subscribe(onNext: Function,
      onError?: Function,
      onComplete?: Function): ISubscription,

      // Returns itself
      [$$observable]: () => IESObservable,

      // Converts items to an Observable
      static of(...items: Array<any>): IESObservable,

      // Converts an observable or iterable to an Observable
      static from(observable: IESObservable | Iterable<any>): IESObservable,
    }

    declare export type ESObservable = Class<IESObservable>
}
