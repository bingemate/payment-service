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
          price_data: {
            unit_amount: 999,
            recurring: {
              interval: 'month',
            },
            currency: 'EUR',
            product: 'prod_O0v1eTKazBiKZX',
          },
        },
      ],
    });
  }
  public constructEvent(body: string, sig: string, key: string) {
    return this.stripe?.webhooks.constructEvent(body, sig, key);
  }
}
