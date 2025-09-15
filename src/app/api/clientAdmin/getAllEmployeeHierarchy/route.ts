import { NextRequest, NextResponse } from "next/server";
import { addDays, dashedDateYYYYMMDD, formatDateYYYYMMDD, funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";


export async function POST(request: NextRequest) {

    try {
        // const { data: user, error: userError } = await supabase.auth.getUser();

        // // Handle case where the user is not authenticated
        // if (userError || !user) {
        //   return NextResponse.json(
        //     { error: 'User not authenticated' },
        //     { status: 401 }
        //   );
        // }
        const formData = await request.formData();
        const fdata = {

            clientID: formData.get('client_id'),
            // branchID: formData.get('branch_id'),
            // departmentID: formData.get('department_id'),
            // designationID: formData.get('designation_id'),
            // sortOrder: formData.get("sortOrder"),
            customer_id: formData.get("customer_id"),
            
        };
        // console.log(fdata);
        

        let query= supabase.from("leap_customer")
            .select(`*,leap_client_designations(*),leap_client_departments(*)`)
            .eq('client_id', fdata.clientID)
            // .not("department_id", "is", null)      // department_id must NOT be NULL
            // .not("designation_id", "is", null) 
            .or("user_role.is.null,user_role.neq.2");//,user_role.neq.2
            //.not("manager_id", "is", null)
        
        // filter
        // if (fdata.branchID) {
        //     query = query.eq("branch_id", fdata.branchID);
        // }
        // if (fdata.departmentID) {
        //     query = query.eq("department_id", fdata.departmentID);
        // }
        // if (fdata.designationID) {
        //     query = query.eq("designation_id", fdata.designationID);
        // }
        if (fdata.customer_id) {
            query = query.eq("customer_id", fdata.customer_id);
        }
        query = query.order('name', { ascending: true });
        
        // if (fdata.sortOrder && fdata.sortOrder=="1") {
            
        // }
        // else if (fdata.sortOrder && fdata.sortOrder=="2") {
        //     query = query.order('name', { ascending: false });
        // }
        
        // need to call filtered data 
        //  console.log(query);
         
        const { data: customerData, error } = await query;
        
        if (error) {
            return funSendApiErrorMessage(error, "Unable to fetch users");
        }

        
        let sortedTree;
        if(fdata.customer_id){
            sortedTree=customerData;
        }else{
            sortedTree=buildHierarchy(customerData)
        }
        
      
        // Step 2: Build tree
        // customerData.forEach(customer => {
        //   if (customer.manager_id) {
        //     const manager = map.get(customer.manager_id);
        //     if (manager) {
        //       manager.reports.push(map.get(customer.id));
        //     }
        //   } else {
        //     roots.push(map.get(customer.id));
        //   }
        // });
        
            return NextResponse.json({ status: 1, message: " All Users", data:sortedTree }, { status: apiStatusSuccessCode })
        ;

    } catch (error) {


        return funSendApiException(error);

    }

}


// function buildHierarchy(flatData: any[]) {
//     // console.log("98889qd8qdyqhd0q89d09qd0-q9d0-9q0-d9-0q90-9q-0dq-0=-=-=-=-===-=-==-",flatData.length);
    
//     const map = new Map<number, any>();
//     const roots: any[] = [];

//     // Step 1: Map each customer and initialize reports array
//     flatData.forEach(customer => {
//         map.set(Number(customer.customer_id), { ...customer, children: [] });
//     });
//     // console.log("98889qd8qdyqhd0q89d09qd0-q9d0-9q0-d9-0q90-9q-0dq-0=-=-=-=-===-=-==-flatData-=-=-=2 ",flatData.length);

//     // Step 2: Assign customers to their manager
//     flatData.forEach(customer => {
//         const custId = Number(customer.customer_id);
//         const mgrId = customer.manager_id != null ? Number(customer.manager_id) : null;
//         // console.log(`custId: ${custId}, manager_id:`, customer.manager_id);

//         if (mgrId != null) {
//             const manager = map.get(mgrId);
//             if (manager) {
//                 manager.children.push(map.get(custId));
//             }
//         } else {
//             const root = map.get(custId);
//             if (root) {
//                 roots.push(root);
//             }
//         }
//     });
//     // console.log("98889qd8qdyqhd0q89d09qd0-q9d0-9q0-d9-0q90-9q-0dq-0=-=-=-=-===-=-==-roots-==-",roots.length);

//     return roots;
// }

function buildHierarchy(flatData: any[]) {
  const map = new Map<number, any>();
  const roots: any[] = [];

  // Step 1: map all customers
  flatData.forEach(customer => {
    map.set(Number(customer.customer_id), { ...customer, children: [] });
  });

  // Step 2: Assign children under managers
  flatData.forEach(customer => {
    const custId = Number(customer.customer_id);
    const mgrId = customer.manager_id != null ? Number(customer.manager_id) : null;
    const node = map.get(custId);

    if (mgrId != null) {
      const manager = map.get(mgrId);
      if (manager) {
        manager.children.push(node);
      }
    }
  });

  // Step 3: Only include directors as roots
  flatData.forEach(customer => {
    if (customer.manager_id == null) {
      // check if Director
      if (
        customer.designation_id === 2  // example: Director role
        
      ) {
        roots.push(map.get(Number(customer.customer_id)));
      }
    }
  });

  return roots;
}





  
  

