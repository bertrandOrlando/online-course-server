import express from "express";
import AuthRoute from "./auth.js";
import UserRoute from "./user.js";
import TransactionRoute from "./transaction.js";
import WebhookRoute from "./webhook.js";
import config from "../../config/config.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/users",
    route: UserRoute,
  },
  {
    path: "/transactions",
    route: TransactionRoute,
  },
  {
    path: "/webhook",
    route: WebhookRoute,
  },
];

const devRoutes = [];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
