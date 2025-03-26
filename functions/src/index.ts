/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

admin.initializeApp();
const corsHandler = cors({origin: "*"});
const app = express();
app.use(cors({origin: true}));


exports.sendPushNotification = functions.https.onRequest(async (req, res,) => {
  corsHandler(req, res, async () => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    try {
      const {title, description, token} = req.body;
      const payload = {
        token: token,
        notification: {
          title: title,
          body: description,
        },
      };

      await admin.messaging().send(payload);
      res.status(200).send(
        {data: null, code: 1, message: "Notificacion enviada"}
      );
    } catch (error) {
      console.error("Error procesando la solicitud:", error);
      res.status(500).send(error);
    }
  });
});
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
