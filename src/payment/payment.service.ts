import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import CustomerService from '../customer/customer.service';

@Injectable()
export default class PaymentService {
  private stripe: Stripe;

  constructor(private customerService: CustomerService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  public async getCheckoutSessionUrl(userId: string) {
    const customer = await this.customerService.getById(userId);
    return await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer ? customer.customerId : undefined,
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
  public constructEvent(body, sig: string, key: string) {
    return this.stripe?.webhooks.constructEvent(body, sig, key);
  }
}
