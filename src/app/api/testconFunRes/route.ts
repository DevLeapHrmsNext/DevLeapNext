import { funGetAdminID, funGetSingleColumnValueCustomer } from "@/app/pro_utils/constantFunGetData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const custsingle=await funGetAdminID(3)
    return NextResponse.json({message:"Test Connection Function Response Success",data:custsingle}, { status: 200 });
}