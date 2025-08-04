/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";

let server: Server;
const startServer = async () => {
  try {
    server = app.listen(5000, () => {
      try {
        console.log(
          `🏦 DigiPay-Digital-Wallet-System is Listening to Port ${5000}.`
        );
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();

// UnHandled Rejection Error //
process.on("unhandledRejection", (err) => {
  console.log("UnHandled Rejection Detected!...🔌Server Shutting Down🔌", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// UnCaught Exception Error //
process.on("uncaughtException", (err) => {
  console.log("🔌UnCaught Exception Detected!...🔌Server Shutting Down🔌", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
//  Signal Termination Error //
process.on("SIGTERM", () => {
  console.log("🔌SIGTERM Signal Received!...🔌Server Shutting Down🔌");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//  Signal Termination (Server Shutting Down manually)//
process.on("SIGINT", () => {
  console.log("🔌Server Shutting Down Gracefully...🔌");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
