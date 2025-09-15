// 'use client'

// import React, { useEffect, useState } from 'react'
// import supabase from '@/app/api/supabaseConfig/supabase';
// import { useRouter } from 'next/navigation';
// import { error } from 'console';
// import { Address, AddressModel, CustomerAddress, EmergencyContact, LeapRelations } from '../models/employeeDetailsModel';
// import LoadingDialog from '@/app/components/PageLoader';
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

// export const UserAddress = () => {
//     // const [userData, setUserData] = useState<Address>();
//     const router = useRouter();

//     const[isLoading,setLoading]=useState(false)
//     const [emergencyContactRelation, setEmergencyRelation] = useState<LeapRelations[]>([]);
//     const [currentAdd, setcurrent] = useState<CustomerAddress>({
//         id: 0,
//         client_id: 0,
//         branch_id: 0,
//         customer_id: 0,
//         address_line1: '',
//         address_line2: '',
//         city: '',
//         state: '',
//         postal_code: '',
//         country: '',
//         latitude: '',
//         longitude: '',
//         is_primary: false,
//         created_at: '',
//         updated_at: '',
//         address_type: '',
//     });
//     const [permenantAdd, setpermenant] = useState<CustomerAddress>({
//         id: 0,
//         client_id: 0,
//         branch_id: 0,
//         customer_id: 0,
//         address_line1: '',
//         address_line2: '',
//         city: '',
//         state: '',
//         postal_code: '',
//         country: '',
//         latitude: '',
//         longitude: '',
//         is_primary: false,
//         created_at: '',
//         updated_at: '',
//         address_type: '',
//     });
//     const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
//         emergency_contact: '',
//         contact_name: '',
//         relation: '',
//         leap_relations: {
//             id: 0,
//             relation_type: '',
//         }
//     })

//     useEffect(() => {
//         const fetchData = async () => {

//             const relationsType = await getRelations();
//             setEmergencyRelation(relationsType);

//             try {
//                 const formData = new FormData();
//                 formData.append("client_id", contextClientID);
//                 formData.append("customer_id", contextSelectedCustId);


//                 const res = await fetch("/api/users/getProfile/getEmployeeAddress", {
//                     method: "POST",
//                     body: formData,
//                 });
//                 console.log(res);

//                 const response = await res.json();

//                 const user = response.data;


//                 for (let i = 0; i < user.customerAddress.length; i++) {
//                     console.log("Inside for loop", user.customerAddress[i].address_type);

//                     if (response.data.customerAddress[i].address_type == "current") {
//                         console.log("Inside if condition ", user.customerAddress[i]);

//                         setcurrent(response.data.customerAddress[i]);
//                     } else {
//                         console.log("Inside else condition ", user.customerAddress[i]);
//                         setpermenant(response.data.customerAddress[i]);
//                     }
//                 }
//                 // setUserData(user);
//                 setEmergencyContact(user.emergencyContact[0])


//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         }
//         fetchData();
//     }, []);

//     const formData = new FormData();



//     // const handleInputChange = (e: any) => {
//     //     const { name, value, type, files } = e.target;
//     //     console.log("Form values updated:", userData);
//     //     // setUserData((prev) => ({ ...prev, [name]: value }));
//     // };
//     const {contextClientID,contextRoleID,contextSelectedCustId}=useGlobalContext();

//     const handleSubmit = async (e: React.FormEvent) => {
//         setLoading(true);
//         {/* AddressDetails details 1 */ }
//         e.preventDefault();
//         console.log("Emeekhbhdhfsdhaba ada-d---------",emergencyContact.emergency_contact);

//         formData.append("customer_id", currentAdd.customer_id+'');
//         formData.append("role_id", contextRoleID);
//         formData.append("current_id", currentAdd.id+'');
//         formData.append("c_address_line1", currentAdd.address_line1);
//         formData.append("c_address_line2", currentAdd.address_line2);
//         formData.append("c_city", currentAdd.city);
//         formData.append("c_state", currentAdd.state);
//         formData.append("c_postal_code", currentAdd.postal_code);
//         formData.append("c_country", currentAdd.country);

//         formData.append("permenant_id", permenantAdd.id+'');
//         formData.append("p_address_line1", permenantAdd.address_line1);
//         formData.append("p_address_line2", permenantAdd.address_line2);
//         formData.append("p_city", permenantAdd.city);
//         formData.append("p_state", permenantAdd.state);
//         formData.append("p_postal_code", permenantAdd.postal_code);
//         formData.append("p_country", permenantAdd.country);

//         formData.append("emergency_contact", emergencyContact.emergency_contact+'');
//         formData.append("contact_name", emergencyContact.contact_name);
//         formData.append("relation", emergencyContact.relation);
//         try{

//             const res = await fetch("/api/users/updateEmployee/updateEmpAddress", {
//                 method: "POST",
//                 body: formData,
//             });
//             const response=await res.json();
//             if(res.ok){
//                 setLoading(false);
//                 alert(response.message);
//             }else{
//                 setLoading(false)
//                 alert(response.message);
//             }
//             }catch(e){
//                 setLoading(false)
//                 alert(e);
//             }

//     }

//     return (
//         <>
//             <form onSubmit={handleSubmit}>
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12 mb-5">

//                             <div className="grey_box">
//                                 <div className="row">
//                                     <div className="col-lg-12">
//                                         <div className="add_form_inner">
//                                             <div className="row">
//                                                 <div className="col-lg-12 mb-4 inner_heading25">
//                                                     Current Address Details:
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Line 1:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="address_line1" value={currentAdd.address_line1|| ""}  name="address_line1" onChange={(e) => setcurrent((prev) => ({ ...prev, ["address_line1"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" > Line 2:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="address_line2" value={currentAdd.address_line2|| ""} name="address_line2" onChange={(e) => setcurrent((prev) => ({ ...prev, ["address_line2"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >City:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="city" value={currentAdd.city|| ""} name="city" onChange={(e) => setcurrent((prev) => ({ ...prev, ["city"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >State: </label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="state" value={currentAdd.state|| ""} name="state" onChange={(e) => setcurrent((prev) => ({ ...prev, ["state"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Postal code:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="postal_code" value={currentAdd.postal_code|| ""} name="postal_code" onChange={(e) => setcurrent((prev) => ({ ...prev, ["postal_code"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Country:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="country" value={currentAdd.country|| ""} name="country" onChange={(e) => setcurrent((prev) => ({ ...prev, ["country"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>&nbsp;
//                         </div>
//                     </div>
//                 </div>
//                 {/* AddressDetails details 2 */}

//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12 mb-5">
//                             <div className="grey_box">
//                                 <div className="row">
//                                     <div className="col-lg-12">
//                                         <div className="add_form_inner">
//                                             <div className="row">
//                                                 <div className="col-lg-12 mb-4 inner_heading25">
//                                                     Permanent Address Details:
//                                                 </div>
//                                             </div>

//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Line 1:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="address_line1" value={permenantAdd.address_line1|| ""} name="address_line1" onChange={(e) => setpermenant((prev) => ({ ...prev, ["address_line1"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Line 2:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="address_line2" value={permenantAdd.address_line2|| ""} name="address_line2" onChange={(e) => setpermenant((prev) => ({ ...prev, ["address_line2"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >City:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="city" value={permenantAdd.city|| ""} name="city" onChange={(e) => setpermenant((prev) => ({ ...prev, ["city"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >State: </label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="state" value={permenantAdd.state|| ""} name="state" onChange={(e) => setpermenant((prev) => ({ ...prev, ["state"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Postal code:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="postal_code" value={permenantAdd.postal_code|| ""} name="postal_code" onChange={(e) => setpermenant((prev) => ({ ...prev, ["postal_code"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Country:</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="country" value={permenantAdd.country|| ""} name="country" onChange={(e) => setpermenant((prev) => ({ ...prev, ["country"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>&nbsp;

//                         </div>
//                     </div>
//                 </div>


//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-12 mb-5">
//                             <div className="grey_box">
//                                 <div className="row">
//                                     <div className="col-lg-12">
//                                         <div className="add_form_inner">
//                                             <div className="row">
//                                                 <div className="col-lg-12 mb-4 inner_heading25">
//                                                     Emergency Contact details:
//                                                 </div>
//                                             </div>

//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Emergency contact:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="emergency_contact" value={emergencyContact.emergency_contact|| ""} name="emergency_contact" onChange={(e) => setEmergencyContact((prev) => ({ ...prev, ["emergency_contact"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Contact person name</label>
//                                                     </div>
//                                                 </div>

//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <input type="text" className="form-control" id="contact_name" value={emergencyContact.contact_name|| ""} name="contact_name" onChange={(e) => setEmergencyContact((prev) => ({ ...prev, ["contact_name"]: e.target.value }))} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="row" style={{ alignItems: "center" }}>
//                                                 <div className="col-md-2">
//                                                     <div className="form_box mb-3">
//                                                         <label htmlFor="exampleFormControlInput1" className="form-label" >Relation:  </label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-md-4">
//                                                     <div className="form_box mb-3">
//                                                         <select id="relation" name="relation" onChange={(e) => setEmergencyContact((prev) => ({ ...prev, ["relation"]: e.target.value }))}>
//                                                             <option value={emergencyContact.leap_relations?.relation_type|| ""}>{emergencyContact?.leap_relations?.relation_type || ""}</option>
//                                                             {emergencyContactRelation.map((relationsType, index) => (
//                                                                 <option value={relationsType.id} key={relationsType.id}>{relationsType.relation_type}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>

//                                             </div>

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>&nbsp;
//                             <div className="row">
//                                 <div className="col-lg-12" style={{ textAlign: "right" }}><input type='submit' value="Update" className={`red_button ${isLoading}:"loading":""`} onClick={handleSubmit} /></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </>
//     )
// }


// async function getRelations() {

//     let query = supabase
//         .from('leap_relations')
//         .select();

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {


//         return data;
//     }
// }



////////////// ritika code merge 
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Address, AddressModel, CustomerAddress, EmergencyContact, LeapRelations } from '../models/userEmployeeDetailsModel';
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';

export const UserAddress = () => {
    // const [userData, setUserData] = useState<Address>();
    const router = useRouter();
    const { contextClientID, contextRoleID, contextCustomerID } = useGlobalContext();
    const [isLoading, setLoading] = useState(false)
    const [currentAdd, setcurrent] = useState<CustomerAddress>();
    const [permenantAdd, setpermenant] = useState<CustomerAddress>();
    const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>()

    useEffect(() => {
        const fetchData = async () => {

            try {

                const res = await fetch("/api/users/getProfile/getEmployeeAddress", {
                    method: "POST",
                    body: JSON.stringify({
                        "client_id": contextClientID,
                        "customer_id": contextCustomerID
                    }),
                });

                const response = await res.json();

                const user = response.data;
                for (let i = 0; i < user.customerAddress.length; i++) {
                    console.log("Inside for loop", user.customerAddress[i].address_type);

                    if (response.data.customerAddress[i].address_type == "current") {
                        console.log("Inside if condition ", user.customerAddress[i]);

                        setcurrent(response.data.customerAddress[i]);
                    } else {
                        console.log("Inside else condition ", user.customerAddress[i]);
                        setpermenant(response.data.customerAddress[i]);
                    }
                }
                // setUserData(user);
                setEmergencyContact(user.emergencyContact[0])
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);



    return (
        <>
            <div className="container" id='address_id'>
                <div className="row">
                    <div className="col-lg-12">
                        {/* Current Address Details start  */}
                        <div className="d_user_new_details_mainbox">
                            <div className="d_user_profile_heading">Current Address Details</div>
                            <div className="d_user_profile_details_listing_box">
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Line 1</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.address_line1 || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Line 2</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.address_line2 || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">City</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.city || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">State</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.state || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Postal code</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.postal_code || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Country</div>
                                    <div className="d_user_profile_details_content">{currentAdd?.country || "--"}</div>
                                </div>
                            </div>
                        </div>
                        {/* Current Address Details ends */}
                        {/* Permanent Address Details start */}
                        <div className="d_user_new_details_mainbox">
                            <div className="d_user_profile_heading">Permanent Address Details</div>
                            <div className="d_user_profile_details_listing_box">
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Line 1</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.address_line1 || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Line 2</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.address_line2 || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">City</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.city || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">State</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.state || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Postal code</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.postal_code || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Country</div>
                                    <div className="d_user_profile_details_content">{permenantAdd?.country || "--"}</div>
                                </div>
                            </div>
                        </div>
                        {/* Permanent Address Details ends */}
                        {/* Emergency Contact details start */}
                        <div className="d_user_new_details_mainbox">
                            <div className="d_user_profile_heading">Emergency Contact details</div>
                            <div className="d_user_profile_details_listing_box">
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Emergency contact</div>
                                    <div className="d_user_profile_details_content">{emergencyContact?.emergency_contact || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Contact person name</div>
                                    <div className="d_user_profile_details_content">{emergencyContact?.contact_name || "--"}</div>
                                </div>
                                <div className="d_user_profile_details_listing">
                                    <div className="d_user_profile_details_subheading">Relation</div>
                                    <div className="d_user_profile_details_content">{emergencyContact?.leap_relations?.relation_type || "--"}</div>
                                </div>
                            </div>
                        </div>
                        {/* Emergency Contact details ends */}
                    </div>
                </div>
            </div>


        </>
    )
}
