// import React, { useEffect, useState } from 'react'
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
// import supabase from '../api/supabaseConfig/supabase';
// import Select from "react-select";
// import { staticIconsBaseURL } from '../pro_utils/stringConstants';


// interface FormValues {
//     branch_id: any,
//     des_depart_name: any,
// }


// const DialogClientAddDesignationDepartment = ({ isDesignationAdd,editDataType,editID,dataToEdit, onClose }: { onClose: () => void,editDataType:any,editID:any,dataToEdit:any, isDesignationAdd: boolean }) => {
//     const { contextClientID, contaxtBranchID } = useGlobalContext();
//     const [formValues, setFormValues] = useState<FormValues>({
//         branch_id: '',
//         des_depart_name: '',
//     });
//     const [isLoading, setLoading] = useState(false);
//     const [branchArray, setBranchArray] = useState([{ value: '', label: '' }]);
//     const [selectedBranch, setSelectedBranch] = useState({ value: '', label: '' });
//     const [errors, setErrors] = useState<Partial<FormValues>>({});

//     useEffect(() => {
//         setFormValues({
//             branch_id:'',
//             des_depart_name:dataToEdit
//         })
//         fetchData();
//     }, [])

//     const fetchData = async () => {


//         setLoading(true);
//         const branch = await getBranches(contextClientID);
//         let extractBranch: any[] = []
//         for (let i = 0; i < branch.length; i++) {

//             extractBranch.push({
//                 value: branch[i].id,
//                 label: branch[i].branch_number,
//             })
//         }

//         setBranchArray(extractBranch);
//     }

//     const onAddClicked = async () => {
        
//         if(!formValues.des_depart_name || formValues.des_depart_name.length==0){
//             const newErrors: Partial<FormValues> = {};
//             newErrors.des_depart_name = "required";

//             setErrors(newErrors);
            
//         }else{
//         setLoading(true);

//         let query;
//         try{
//             if(editID<0){
//         if (isDesignationAdd) {
//             query = supabase
//                 .from('leap_client_designations')
//                 .insert({
//                     client_id: contextClientID,
//                     branch_id: formValues.branch_id,
//                     designation_name: formValues.des_depart_name,
//                     created_at: new Date(),
//                 });
//         } else {
//             query = supabase
//                 .from('leap_client_departments')
//                 .insert({
//                     client_id: contextClientID,
//                     branch_id: formValues.branch_id,
//                     department_name: formValues.des_depart_name,
//                     created_at: new Date(),
//                 });

//         }
//         const { data, error } = await query;
//         if (error) {
//             setLoading(false)
//             console.log(error);
//             alert("Unable to Insert Data ")

//         } else {
//            setLoading(false)
//            alert(isDesignationAdd?"Designation added successfully":"Department added successfully");
//         }
//     }else{
//         setLoading(true);

//         let query;
        
//         if (dataToEdit=="Designation") {
//             query = supabase
//                 .from('leap_client_designations')
//                 .update({
                    
//                     designation_name: formValues.des_depart_name,
                    
//                 }).eq("designation_id",editID);
//         } else {
//             query = supabase
//                 .from('leap_client_departments')
//                 .update({
                    
//                     department_name: formValues.des_depart_name,
                   
//                 }).eq("department_id",editID);
        
//         }
//         const { data, error } = await query;
//         if (error) {
//             setLoading(false)
//             console.log(error);
//             alert("Unable to Insert Data ")
        
//         } else {
//            setLoading(false)
//            alert({editDataType}+" added successfully");
//         }
        
        
        
//     }


// //////heere is the edit code



    
//     }catch(e){
//         console.log(e);
        
//         alert("Failed with exception")
//     }
//         }
//     }

//     return (
//         <div className="loader-overlay">
//             <div className="loader-dialog">
//                 <div className="row">
//                     <div className="col-lg-12" style={{ textAlign: "right" }}>
//                         <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
//                             onClick={onClose} />
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12 mb-4 inner_heading25 text-center">
//                         {editID>0?`Edit ${editDataType}` :"Add" +`${isDesignationAdd} ? "Designation" : "Department"`}
//                     </div>
//                 </div>
//                 <form >

//                     <div className="row">

//                         {/* <div className="col-md-6">
//                             <div className="form_box mb-3">
//                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:  </label>
//                                 <Select
//                                     className="custom-select"
//                                     classNamePrefix="custom"
//                                     options={branchArray}
//                                     onChange={(selectedOption) =>
//                                         // handleEmployeeChange(selectedOption)
//                                         {
                                        
//                                         setFormValues((prev) => ({ ...prev, ['branch_id']: selectedOption?.value }))
//                                         }
//                                     }
//                                     placeholder="Search Branch"
//                                     isSearchable
//                                 />
//                             </div>
//                         </div> */}
//                         <div className="col-md-12">
//                             <div className="form_box mb-3">
//                                 <label htmlFor="exampleFormControlInput1" className="form-label" >{editID>0?editDataType:  isDesignationAdd?"Designation Name":"Department Name"}:  </label>
//                                 <input type="text" className="form-control" value={formValues.des_depart_name} name="des_depart_name" onChange={(e) => setFormValues((prev) => ({ ...prev, ['des_depart_name']: e.target.value }))} id="des_depart_name" />
//                                 {errors.des_depart_name && <span className="error" style={{color: "red"}}>{errors.des_depart_name}</span>}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="row mb-3">
//                         <div className="col-lg-12 " style={{ textAlign: "center" }}>
//                             <input type='button' value={editID>0?"Update" :"Add"} className="red_button" onClick={onAddClicked}/>
//                         </div>

//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default DialogClientAddDesignationDepartment


// async function getBranches(clientID: any) {

//     let query = supabase
//         .from('leap_client_branch_details')
//         .select('id,branch_number')
//         .eq("client_id", clientID);

//     const { data, error } = await query;
//     if (error) {
//         console.log(error);

//         return [];
//     } else {
//         return data;
//     }

// }


import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import supabase from '../api/supabaseConfig/supabase';
import Select from "react-select";
import { staticIconsBaseURL } from '../pro_utils/stringConstants';


interface FormValues {
    branch_id: any,
    des_depart_name: any,
}


const DialogClientAddDesignationDepartment = ({ isDesignationAdd,editDataType,editID,dataToEdit, onClose }: { onClose: () => void,editDataType:any,editID:any,dataToEdit:any, isDesignationAdd: boolean }) => {
    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [formValues, setFormValues] = useState<FormValues>({
        branch_id: '',
        des_depart_name: '',
    });
    const [isLoading, setLoading] = useState(false);
    const [branchArray, setBranchArray] = useState([{ value: '', label: '' }]);
    const [selectedBranch, setSelectedBranch] = useState({ value: '', label: '' });
    const [errors, setErrors] = useState<Partial<FormValues>>({});

    useEffect(() => {
        setFormValues({
            branch_id:'',
            des_depart_name:dataToEdit
        })
        fetchData();
    }, [isDesignationAdd,editDataType,editID,dataToEdit])

    const fetchData = async () => {


        setLoading(true);
        const branch = await getBranches(contextClientID);
        let extractBranch: any[] = []
        for (let i = 0; i < branch.length; i++) {

            extractBranch.push({
                value: branch[i].id,
                label: branch[i].branch_number,
            })
        }

        setBranchArray(extractBranch);
    }

    const onAddClicked = async () => {
        
        if(!formValues.des_depart_name || formValues.des_depart_name.length==0){
            const newErrors: Partial<FormValues> = {};
            newErrors.des_depart_name = "required";

            setErrors(newErrors);
            
        }else{
        setLoading(true);

        let query;
        try{
            if(editID<0){
        if (isDesignationAdd) {
            query = supabase
                .from('leap_client_designations')
                .insert({
                    client_id: contextClientID,
                    branch_id: formValues.branch_id,
                    designation_name: formValues.des_depart_name,
                    created_at: new Date(),
                });
        } else {
            query = supabase
                .from('leap_client_departments')
                .insert({
                    client_id: contextClientID,
                    branch_id: formValues.branch_id,
                    department_name: formValues.des_depart_name,
                    created_at: new Date(),
                });

        }
        const { data, error } = await query;
        if (error) {
            setLoading(false)
            console.log(error);
            alert("Unable to Insert Data ")

        } else {
           setLoading(false)
           alert(isDesignationAdd?"Designation added successfully":"Department added successfully");
        }
    }else{
        setLoading(true);

        let query;
        
        if (editDataType=="Designation") {
            query = supabase
                .from('leap_client_designations')
                .update({
                    
                    designation_name: formValues.des_depart_name,
                    
                }).eq("designation_id",editID);
        } else {
            query = supabase
                .from('leap_client_departments')
                .update({
                    
                    department_name: formValues.des_depart_name,
                   
                }).eq("department_id",editID);
        
        }
        const { data, error } = await query;
        if (error) {
            setLoading(false)
            console.log(error);
            alert("Unable to Insert Data ")
        
        } else {
           setLoading(false)
           alert({editDataType}+" added successfully");
        }        
        
    }


//////heere is the edit code



    
    }catch(e){
        console.log(e);
        
        alert("Failed with exception")
    }
        }
    }

    return (
        <div className="">
            <div className="">
                <div className='rightpoup_close' onClick={onClose}>
                    <img src={staticIconsBaseURL+"/images/close_white.png"} alt="Search Icon" title='Close'/>
                </div>
                <div className="row">
                    <div className="col-col-lg-12 mb-4 inner_heading25">
                        {editID>0?`Edit ${editDataType}` :"Add" +`${isDesignationAdd ? " Designation" : " Department"}`}
                    </div>
                </div>
                <form >

                    <div className="row">

                        {/* <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:  </label>
                                <Select
                                    className="custom-select"
                                    classNamePrefix="custom"
                                    options={branchArray}
                                    onChange={(selectedOption) =>
                                        // handleEmployeeChange(selectedOption)
                                        {
                                        
                                        setFormValues((prev) => ({ ...prev, ['branch_id']: selectedOption?.value }))
                                        }
                                    }
                                    placeholder="Search Branch"
                                    isSearchable
                                />
                            </div>
                        </div> */}
                        <div className="col-md-12">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >{editID>0?editDataType:  isDesignationAdd?"Designation Name":"Department Name"}:  </label>
                                <input type="text" className="form-control" value={formValues.des_depart_name} name="des_depart_name" onChange={(e) => setFormValues((prev) => ({ ...prev, ['des_depart_name']: e.target.value }))} id="des_depart_name" />
                                {errors.des_depart_name && <span className="error" style={{color: "red"}}>{errors.des_depart_name}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-12">
                            <input type='button' value={editID>0?"Update" :"Add"} className="red_button" onClick={onAddClicked}/>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default DialogClientAddDesignationDepartment


async function getBranches(clientID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select('id,branch_number')
        .eq("client_id", clientID);

    const { data, error } = await query;
    if (error) {
        console.log(error);

        return [];
    } else {
        return data;
    }

}