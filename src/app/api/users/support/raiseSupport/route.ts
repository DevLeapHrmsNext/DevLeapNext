// this API is used to insert support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { formatDateYYYYMMDD, funDataAddedSuccessMessage, funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { addErrorExceptionLog, addUserActivities } from "@/app/pro_utils/constantFunAddData";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funGetAdminID, funGetSingleColumnValueCustomer, funGetSupportType } from "@/app/pro_utils/constantFunGetData";
export const runtime = "nodejs";

function formatToYYMMDD(date: Date) {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

const currentDate = new Date();
const formattedDate = formatToYYMMDD(currentDate);

function generateTicketId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '#' + formattedDate + '-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { client_id, customer_id, branch_id, type_id, description, priority_level, contact_number } = await request.json();

    const ticketId = generateTicketId();

    const { data: supportData, error: supportError } = await supabase.from('leap_client_employee_requests')
      .insert({
        client_id: client_id,
        customer_id: customer_id,
        branch_id: branch_id,
        type_id: type_id,
        description: description,
        priority_level: priority_level,
        active_status: "1",
        ticket_id: ticketId,
        created_at: new Date().toISOString(),
        raised_on: new Date()
      }).select();
    if (supportError) {
      return funSendApiErrorMessage(supportError, "Failed to raise support ticket");
    }


    (async () => {
      try {
        if (contact_number) {
          const payload = {
            apiKey: process.env.NEXT_PUBLIC_AISENSY_API_KEY,
            campaignName: "raise_ticket_id",
            destination: contact_number,
            userName: "$Name",
            templateParams: [ticketId],  // ["raised ticket"],
            source: "new-landing-page form",
            media: {},
            buttons: [],
            carouselCards: [],
            location: {},
            attributes: {},
            paramsFallbackValue: { FirstName: "user" }
          };

          const res = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const body = await res.text();
          console.log("AiSensy response:" ,contact_number, res.status, body);
        }
      } catch (err: any) {
        console.log("AiSensy WhatsApp error:", err);
        await addErrorExceptionLog(client_id, customer_id, "AiSensy WhatsApp error", { exception: err.toString(), ticketId, contact_number });
      }
    })();


    (async () => {
      let supportType = "";
      try {
        const supportType = await funGetSupportType(type_id);
        const addActivity = await addUserActivities(client_id, customer_id, branch_id, "Support", supportType + "-" + ticketId, supportData[0].id, false);
        throw addActivity;
      } catch (err) {

        if (err === "1") {
          const dataPassed = { client_id: client_id, customer_id: customer_id, branch_id: branch_id, activity_type: "Support", activity_details: supportType + "-" + ticketId, activity_related_id: supportData[0].id, user_notify: false };
          await addErrorExceptionLog(client_id, customer_id, "Raise support activity log error", `failed to raise support activity log with data :${dataPassed}`);
        }
        else if (err) { await addErrorExceptionLog(client_id, customer_id, "Raise support activity log error", { exception: err.toString() }); }
      }
      if (customer_id) {
        const custName = await funGetSingleColumnValueCustomer(customer_id, "name");
        const admin_id = await await funGetAdminID(client_id);
        try {
          const { data: shouldNotify, error } = await supabase.from("leap_client_notification_selected_types").select("*").eq("selected_notify_type_id", 5);
          if (shouldNotify && shouldNotify.length === 0) {

            if (admin_id) {
              const adminFormData = new FormData();
              adminFormData.append("customer_id", String(admin_id));
              adminFormData.append("title", "Support Raised");
              adminFormData.append("notify_type", "5");// its 5 for support in leap_push_notification_types table
              adminFormData.append("message", custName + " has raised a support ticket: " + ticketId + ".");
              const adminRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendPushNotification`, {
                method: "POST",
                body: adminFormData
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    })();
    return NextResponse.json({ status: 1, message: "Support ticket raised successfully", data: "" }, { status: apiStatusSuccessCode });
    // return funDataAddedSuccessMessage("Support ticket raised successfully");

  } catch (error) {
    return funSendApiException(error);
  }
}