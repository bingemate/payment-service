import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export default class StripeService {
  private stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async getCheckoutSubscribeUrl(
    userId: string,
    customerId: string | undefined,
  ) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      mode: 'subscription',
      customer: customerId,
      client_reference_id: userId,
      success_url: `${process.env.FRONT_URL}/subscription/success`,
      cancel_url: `${process.env.FRONT_URL}/subscriptions/subscriptions-list`,
      allow_promotion_codes: true,
      currency: 'EUR',
      line_items: [
        {
          quantity: 1,
          price: 'price_1NEtBTBs8hPuOGwOynwwc2iQ',
        },
      ],
    });
  }

  async getCheckoutMethodUrl(subscriptionId: string, customerId: string) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      mode: 'setup',
      customer: customerId,
      success_url: `${process.env.FRONT_URL}`,
      cancel_url: `${process.env.FRONT_URL}`,
      setup_intent_data: {
        metadata: {
          customer_id: customerId,
          subscription_id: subscriptionId,
        },
      },
    });
  }

  async updatePaymentMethod(subscriptionId: string, intentId: string) {
    const intent = await this.stripe.setupIntents.retrieve(intentId);
    const paymentId = intent.payment_method;
    this.stripe.subscriptions.update(subscriptionId, {
      default_payment_method: paymentId,
    });
  }

  constructEvent(body, sig: string, key: string) {
    return this.stripe?.webhooks.constructEvent(body, sig, key);
  }
}
