import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export default class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  public async getCheckoutSessionUrl(userId: string) {
    return await this.stripe.checkout.sessions.create({
      mode: 'subscription',
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
  public constructEvent(body: string, sig: string, key: string) {
    return this.stripe?.webhooks.constructEvent(Buffer.from(body), sig, key);
  }
}
