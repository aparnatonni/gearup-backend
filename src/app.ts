import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import { paymentController } from './modules/payment/payment.controller';

const app: Application = express();

app.use(cors());

// IMPORTANT: the Stripe webhook route needs the RAW request body (not JSON-parsed)
// to verify the signature Stripe sends. So it's registered BEFORE express.json(),
// using express.raw() only for this one route. See Step 7 in payment module.
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook,
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'GearUp API is running 🏋️',
  });
});

app.use('/api', router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
