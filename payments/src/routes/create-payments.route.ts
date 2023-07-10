import { HttpException, orderStatus, privateRoute } from "@sh-tickets/common";
import { Router } from "express";
import validatePaymentData from "../middlewares/validate-payment-data.middleware";
import { orderModel } from "../models/order";
import { stripe } from "../stripe";
import { paymentsModel } from "../models/payments";
import { PaymentSuccessPublisher } from "../events/publisher/payments-success-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/payments",
  privateRoute,
  validatePaymentData,
  async (req, res, next) => {
    try {
      const { token, orderId } = req.body;

      const order = await orderModel.findById(orderId);

      if (!order) {
        throw new HttpException(404, "Order not found");
      }

      if (order.userId !== req.user!.id) {
        throw new HttpException(401, "Not authorized");
      }

      if (order.status === orderStatus.cancelled) {
        throw new HttpException(400, "Order is cancelled");
      }

      const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token,
      });

      const payment = paymentsModel.build({
        orderId,
        stripeId: charge.id,
      });

      await payment.save();

      await new PaymentSuccessPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });

      order.set({ status: orderStatus.complete });

      res.send({
        success: true,
        data: null,
        message: "Payment successful",
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as createPaymentsRouter };
