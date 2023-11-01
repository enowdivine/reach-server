import express, { json, Request, Response, Router } from "express";
const fapshi = require("./fapshi");
const router: Router = express.Router();

router.post("/fapshi-webhook", json(), async (req: Request, res: Response) => {
  // Get the transaction status from fapshi's API to be sure of its source
  const event = await fapshi.paymentStatus(req.body.transId);

  if (event.statusCode !== 200)
    return res.status(400).send({ message: event.message });

  // Handle the event
  switch (event.status) {
    case "SUCCESSFUL":
      // Then define and call a function to handle a SUCCESSFUL payment
      console.log(event, "successful");
      break;
    case "FAILED":
      // Then define and call a function to handle a FAILED payment
      console.log(event, "failed");
      break;
    case "EXPIRED":
      // Then define and call a function to handle an expired transaction
      console.log(event, "expired");
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event status: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

export default router;
