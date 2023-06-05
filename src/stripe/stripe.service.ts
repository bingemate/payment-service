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

  async getCheckoutSessionUrl(userId: string, customerId: string | undefined) {
    return await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: userId,
      success_url: `${process.env.FRONT_URL}/subscription/success`,
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

  constructEvent(body, sig: string, key: string) {
    return this.stripe?.webhooks.constructEvent(body, sig, key);
  }
}
