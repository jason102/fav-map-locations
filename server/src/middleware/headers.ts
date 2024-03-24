import { Express } from "express";
import helmet from "helmet";
import cors from "cors";

export const corsMiddleware = cors({
  credentials: true,
  origin: process.env.URL || "http://localhost:5173", // TODO: Replace with process.env.LOCALHOST_URL
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
});

export const configureRequestHeaders = (app: Express) => {
  // https://github.com/apollographql/apollo-server/issues/7628
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            "data:",
            "apollo-server-landing-page.cdn.apollographql.com",
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            "apollo-server-landing-page.cdn.apollographql.com",
          ],
          frameSrc: [`'self'`, "sandbox.embed.apollographql.com"],
        },
      },
    })
  );

  app.use(corsMiddleware);
};
