// this API is used to insert support request data in the table

import { NextRequest, NextResponse } from "next/server";
import { funSendApiErrorMessage, funSendApiException, parseForm } from "@/app/pro_utils/constant";
import fs from "fs/promises";
import { addUserActivities } from "@/app/pro_utils/constantFunAddData";
import supabase from "@/app/api/supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
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
  let result = '#'+formattedDate+'-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const {client_id, customer_id, branch_id, type_id, description, priority_level} = await request.json();
    // const fdata = {
    //   client_id: formData.get('client_id'),
    //   customer_id: formData.get('customer_id'),
    //   branch_id: formData.get('branch_id'),
    //   type_id: formData.get('type_id'),
    //   description: formData.get('description'),
    //   priority_level: formData.get('priority_level'),
    // }

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
    const addActivity= await addUserActivities(client_id, customer_id, branch_id, "Support", type_id, supportData[0].id,false);
        if(addActivity=="1"){
          return funSendApiErrorMessage(addActivity, "Customer Support Activity Insert Issue");
        }
    return NextResponse.json({ status: 1, message: "Support ticket raised successfully", data: supportData }, { status: apiStatusSuccessCode })

  } catch (error) {
    return funSendApiException(error);
  }
}