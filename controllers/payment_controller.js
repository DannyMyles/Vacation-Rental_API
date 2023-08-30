const helper = require("../helper/helper");
const catchAsyncFunc = require("../middlewares/catchAsyncFunc");
const createOrRetrieveCustomer = require("../utils/createStripeCustomer");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

exports.createPaymentIntent = catchAsyncFunc(async (req, res, next) => {
  try {
    const {
      amount,
      email,
      booking_id,
      userId,
      paymentMethod,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!booking_id) missingFields.push('bookingId');
    if (!userId) missingFields.push('userId');
    if (!email) missingFields.push('email');
    if (!paymentMethod) missingFields.push('paymentMethod');

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const userDetails = {
      email: email,
      userId: userId
    }

    const customerId = createOrRetrieveCustomer(userId, userDetails);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      description: `Booking #${booking_id}`,
      metadata: {
        booking_id: booking_id,
      },
      customer: customerId,
      receipt_email: email,
      payment_method: paymentMethod,

    });


    console.log('PAYMENT INTENT', paymentIntent);
    //// Confirm the payment intent



    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);

    // Handle payment outcome
    if (confirmedPaymentIntent.status === 'succeeded') {

      const invoice = await stripe.invoices.create({
        customer: userId,
        description: 'Invoice for your Utotel Booking',
      });

      // Send the invoice to the customer's email
      await stripe.invoices.sendInvoice(invoice.id);

      // Payment successful
      return res.status(200).json({
        status: confirmedPaymentIntent.status, receipt_email: confirmedPaymentIntent.receipt_email, amount_received: confirmedPaymentIntent.amount_received, metadata: confirmedPaymentIntent.metadata,
      });
    } else {
      // Payment failed
      return res.status(400).json({ status: false, data: confirmedPaymentIntent.error });
    }


  } catch (error) {
    // Handle stripe errors
    if (error.code === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: error.message });
    }
    // Handle other errors
    res.status(500).json({ error: 'An error occurred -' + error });
  }
});
