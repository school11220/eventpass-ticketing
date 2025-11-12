declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface RazorpayOrderOptions {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, any>;
  }

  interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    orders: {
      create(options: RazorpayOrderOptions): Promise<RazorpayOrder>;
    };
  }

  export default Razorpay;
}
