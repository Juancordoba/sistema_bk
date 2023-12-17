import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios'
import { Result } from 'postcss';


const token = "EABjbyuES9MwBO3yeQcUHbdeTfP2RK1O5b0XggEulH1luG2tIZCDqe6EgmXodpIyf5LagPkKrhYAXAujDCaKdL9lanvH82fYVDZAbw0Y9svyFec9CFDcijzjeIMUCShD5saS48ZCwf17odm55XEgPTjGQRW1GoeZBy580ODlum9swKXY8qQrbs2JtnfIoRUQZAQMm75yiz7Tray94ZD";

export async function POST(req:Request, res:Response) {

  let data = await req.json();
  
  //developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (data.object) {
    if (
      data.entry &&
      data.entry[0].changes &&
      data.entry[0].changes[0] &&
      data.entry[0].changes[0].value.messages &&
      data.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
      data.entry[0].changes[0].value.metadata.phone_number_id;
      let from = data.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = data.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: " + msg_body },
        },
        headers: { "Content-Type": "application/json" },
      });
    }
    return NextResponse.json({status:200})
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    return NextResponse.json({status:404});
  }
}


// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
// app.get("/webhook", (req, res) => {

export async function GET(req:Request, res:NextResponse) {
    /**
     * UPDATE YOUR VERIFY TOKEN
     *This will be the Verify Token value when you set up webhook
    **/
    const verify_token = "MITOKEN";
  
    let data = await req.json();

    // Parse params from the webhook verification request
    let mode = data["hub.mode"];
    let token = data["hub.verify_token"];
    let challenge = data["hub.challenge"];
  
    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct 
      if (mode === "subscribe" && token === verify_token) {
        // Respond with 200 OK and challenge token from the request
        console.log("WEBHOOK_VERIFIED");
      //  res.status(200).send(challenge);
        return NextResponse.json({status:200})
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        return NextResponse.json({status:403})
      }
    }
  };