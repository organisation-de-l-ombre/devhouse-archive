/*
 * Runs the server.
 */

import Server from "./Server";
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: "https://ca385edd845b495a83339f12f21701c6@o487534.ingest.sentry.io/5546417",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

new Server(parseInt(process.env.PORT || '5000'));
