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
import * as moment from "moment-timezone";
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


exports.scheduledDob = functions.pubsub.schedule("0 14 * * *").
  timeZone("America/Los_Angeles").onRun(async (context) => {
    const db2 = admin.firestore();
    const currentDate = moment().tz("America/Los_Angeles").format("DD/MM");
    console.log("ali1");
    const customersRef = await db2.collection("customers").get();
    const batch = db2.batch();
    customersRef.forEach(async (doc) => {
      console.log("ali2");
      console.log(doc.data().isBirthdayConfig);
      if (doc.data().isBirthdayConfig === true) {
        const usersRef = await db2.collection("users")
          .where("customerId", "==", doc.data().uid).get();
        usersRef.forEach(async (doc2) => {
          if (doc2.data().dob !== "") {
            const formatDob = moment(doc2.data().dob).format("DD/MM");
            console.log(formatDob);
            console.log(currentDate);
            if (formatDob === currentDate) {
              if (doc2.data().token !== "") {
                const payload = {
                  token: doc2.data().token,
                  notification: {
                    title:
                      doc.data().birthdayTitle ||
                      "Feliz Cumpleaños",
                    body:
                      doc.data().birthdayDescription ||
                      "Te deseamos un feliz día",
                  },
                };
                await admin.messaging().send(payload);
              }
            }
          }
        });
      }
    });
    return batch.commit();
  });
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
