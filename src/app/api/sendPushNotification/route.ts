import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";
import { funSendApiErrorMessage } from "@/app/pro_utils/constant";

async function getAccessToken() {
  let credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS!);
  // console.log("private key slice",credentials.private_key.slice(0, 50)); // should start with "-----BEGIN PRIVATE KEY-----"

  credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');


  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const client = await auth.getClient();
  // console.log("this is the client in getAccessToken------> ",client);

  const token = await client.getAccessToken();
  // console.log("this is the token in getAccessToken------> ",token);

  return token?.token;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const fdata = {

    title: formData.get('title'),
    customer_id: formData.get('customer_id'),
    message: formData.get('message'),
    client_id: formData.get('client_id'),
    send_once: formData.get('send_once'),
    notify_type: formData.get('notify_type'),
    attachment_url: formData.get('attachment_url'),
    navigation_url: formData.get('navigation_url') || "/",

  }

  console.log("this is the navigation url in the send notification api", fdata.navigation_url);

  const supabase = createClient();

  let getFcmQuery = supabase
    .from("leap_customer_fcm_tokens")
    .select("fcm_token")
  if (fdata.customer_id) {
    getFcmQuery = getFcmQuery.eq("customer_id", fdata.customer_id);
  }

  const { data: tokens, error } = await getFcmQuery;
  if (error) {
    return funSendApiErrorMessage(error, "Failed to get Tokens with error");
  }
  let getWebFcmQuery = supabase
    .from("leap_customer_fcm_tokens")
    .select("web_fcm_tokens")
  if (fdata.customer_id) {
    getWebFcmQuery = getWebFcmQuery.eq("customer_id", fdata.customer_id);
  }

  const { data: webtokens, error: webError } = await getWebFcmQuery;
  if (webError) {
    return funSendApiErrorMessage(error, "Failed to get Web Tokens with error");
  }
  if (!tokens || tokens.length === 0 || !webtokens || webtokens.length === 0) {
    return funSendApiErrorMessage("Not a single token is available" + fdata.customer_id, "Failed to get Tokens");
  }
  const accessToken = await getAccessToken();
  // console.log("this is the accessToken ------> ",accessToken);

  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Failed to get access token" });
  }

  const fcmUrl = `https://fcm.googleapis.com/v1/projects/aipexhrms-fb0fd/messages:send`;

  let sendNotifictaion = true;
  if (fdata.send_once && fdata.send_once === "1") {
    let notificationSentQuery;
    if (fdata.notify_type === "1") {
      notificationSentQuery = supabase.from("leap_push_notifications")
        .select("*")
        .eq("customer_id", fdata.customer_id)
        .eq("notify_type_id", fdata.notify_type)
        .or("is_success.cs.{1},is_success_web.cs.{1}");
    }
    else {
      notificationSentQuery = supabase.from("leap_push_notifications")
        .select("*")
        .eq("customer_id", fdata.customer_id)
        .eq("notify_type_id", fdata.notify_type)
        .or(
          "is_success[array_length(is_success,1)].eq.1," +
          "is_success_web[array_length(is_success_web,1)].eq.1"
        )
    }
    const { data: alreadySentData, error: alreadySentError } = await notificationSentQuery;
    if (alreadySentError) {
      return funSendApiErrorMessage(alreadySentError, "Failed to check already sent notification");
    }
    if (alreadySentData && alreadySentData.length > 0) {
      sendNotifictaion = false;
    }

  }
  try {
    if (sendNotifictaion) {
      if (tokens) {
        for (const tokenData of tokens) {
          // Mobile notification payload
          const notificationPayload: any = {
            message: {
              token: tokenData.fcm_token,
              notification: {
                title: fdata.title,
                body: fdata.message
              },
              data: {
                title: fdata.title,
                body: fdata.message,
                click_action: 'FLUTTER_NOTIFICATION_CLICK', // Standard for Flutter
                url: fdata.navigation_url || '', // Always include URL
              }
            }
          };

          // Add attachment if present
          if (fdata.attachment_url) {
            notificationPayload.message.data.attachment = fdata.attachment_url;
            notificationPayload.message.data.attachment_type = 'url'; // Set once
          }

          const response = await fetch(fcmUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(notificationPayload),
          });
          console.log("this is the response from fcm for mobile------>", response.ok);

          if (!response.ok) {
            
            let insertNotify = supabase.from("leap_push_notifications").insert({
              client_id: fdata.client_id,
              customer_id: fdata.customer_id,
              message_body: fdata.title,
              notify_type_id: fdata.notify_type,
              sent_count: 1,
              is_success: [0],
              
              created_at: new Date(),
              error_log:response
            });
            const { error: notifyError } = await insertNotify;
            if (notifyError) {
              console.log("==-===-=-=-=-=-==-==-=-==-==-==--=-=-=-=-=-=--=-=-=-=-=-=-",notifyError);
              
              return funSendApiErrorMessage(error, "Failed to send Push Notification");
            }


          } else {
            let insertNotify = supabase.from("leap_push_notifications").insert({
              client_id: fdata.client_id,
              customer_id: fdata.customer_id,
              message_body: fdata.title,
              notify_type_id: fdata.notify_type,
              sent_count: 1,
              is_success: [1],
              
              created_at: new Date()
            });
            const { error: notifyError } = await insertNotify;

            if (notifyError) {
              console.log("==-===-=-=-=-=-==-==-=-==-==-==--=-=-=-=-=-=--=-=-=-=-=-=-",notifyError);

              return NextResponse.json({ status: 1, message: "Push Notification sent" });
            }
          }
        }
      }
      // if(fdata.notify_type!=="1"){
      if (webtokens) {
        for (const tokenData of webtokens) {
          // Web notification payload
          console.log("Sending to token:", tokenData.web_fcm_tokens);

          const webNotificationPayload: any = {
            message: {
              token: tokenData.web_fcm_tokens,
              notification: {
                title: fdata.title,
                body: fdata.message
              },
              data: {
                title: fdata.title,
                body: fdata.message,
                click_action: 'OPEN_URL',
                url: fdata.navigation_url || '',
              },
              webpush: {
                headers: {
                  Urgency: "high"
                },
                fcm_options: {
                  link: fdata.navigation_url || '/'
                }
              }
            }
          };

          // Add attachment for web
          if (fdata.attachment_url) {
            webNotificationPayload.message.data.attachment = fdata.attachment_url;
            webNotificationPayload.message.webpush.notification = {
              image: fdata.attachment_url,
              actions: [{
                action: "view_attachment",
                title: "View Attachment",
                icon: fdata.attachment_url
              }]
            };
          }

          const webResponse = await fetch(fcmUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(webNotificationPayload),
          });
          console.log("this is the response from fcm for web------>", webResponse.ok);
          if (!webResponse.ok) {
            console.log(await webResponse.json());
            let insertNotify = supabase.from("leap_push_notifications").insert({
              client_id: fdata.client_id,
              customer_id: fdata.customer_id,
              message_body: fdata.title,
              notify_type_id: fdata.notify_type,
              sent_count: 1,
              
              is_success_web: [0],
              created_at: new Date(),
              error_log:webResponse
            });
            const { error: notifyError } = await insertNotify;

            if (notifyError) {
              return funSendApiErrorMessage(error, "Failed to send Push Notification");
            }

          } else {
            let insertNotify = supabase.from("leap_push_notifications").insert({
              client_id: fdata.client_id,
              customer_id: fdata.customer_id,
              message_body: fdata.title,
              notify_type_id: fdata.notify_type,
              sent_count: 1,
              
              is_success_web: [1],
              created_at: new Date()
            });
            const { error: notifyError } = await insertNotify;

            if (notifyError) {
              console.log(notifyError);
              
              return NextResponse.json({ status: 0, message: "Push Notification not added" });
            }
          }
        }
      }

      // }
    }

    return NextResponse.json({ success: true, message: "Notifications sent successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
}


