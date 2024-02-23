import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  console.log("webhook", { topic, shop, session, admin, payload });

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }
  console.log("topic", topic);
  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    // case "CUSTOMERS_DATA_REQUEST":
    // case "CUSTOMERS_REDACT":
    // case "SHOP_REDACT":
    case "PRODUCTS_CREATE":
      console.log("payload CREATE", payload);
      break;
    case "PRODUCTS_UPDATE":
      console.log("payload UPDATE", payload);
      break;
    case "PRODUCTS_DELETE":
      console.log("payload DELETE", payload);
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
