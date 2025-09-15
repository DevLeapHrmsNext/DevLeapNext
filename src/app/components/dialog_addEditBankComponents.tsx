// import React, { useEffect, useState } from 'react'
// import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
// import supabase from '../api/supabaseConfig/supabase';
// import Select from "react-select";
// import { bankComponentDataType, staticIconsBaseURL } from '../pro_utils/stringConstants';





// const DialogAddEditBankComponents = ({ isComponentAdd,componentValue, onClose }: { onClose: () => void,isComponentAdd:boolean,componentValue:ClientBankComponentsDataModel }) => {
//     const { contextClientID, contaxtBranchID } = useGlobalContext();
//     const [formValues, setFormValues] = useState<BankComponentsAddEditForm>({
//         branch_id:'',
//         component_id: '',
//         componentName: '',
//         componentDataType: '',
//     });
//     const [isLoading, setLoading] = useState(false);
//     const [branchArray, setBranchArray] = useState([{ value: '', label: '' }]);
//     const [selectedBranch, setSelectedBranch] = useState({ value: '', label: '' });
//     const [errors, setErrors] = useState<Partial<BankComponentsAddEditForm>>({});

//     useEffect(() => {
//         if(!isComponentAdd){
//             setFormValues({
//                 branch_id:componentValue.branch_id,
//                 component_id:componentValue.id,
//                 componentName:componentValue.component_name,
//                 componentDataType:componentValue.data_type
//             })
//         }
        
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
//             if(componentValue.branch_id==branch[i].id){
//                 setSelectedBranch({value: branch[i].id,
//                     label: branch[i].branch_number})
//             }
//         }

//         setBranchArray(extractBranch);
        
//     }
//     const validate = () => {
//         const newErrors: Partial<BankComponentsAddEditForm> = {};
        

        
        
//         if (!formValues.branch_id) newErrors.branch_id = "required";
//         if (!formValues.componentName) newErrors.componentName = "required";
//         if (!formValues.componentDataType) newErrors.componentDataType = "required";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     }
//     const onAddClicked = async () => {
//         if(!validate()) return;
//         setLoading(true);
//         try{
//             let query;
        
//             if (isComponentAdd) {
//                 query = supabase
//                     .from('leap_client_bank_details_components')
//                     .insert({
//                         client_id: contextClientID,
//                         branch_id: formValues.branch_id,
//                         component_name: formValues.componentName,
//                         data_type: formValues.componentDataType,
//                         created_at:new Date()
//                     });
//             } else {
//                 query = supabase
//                     .from('leap_client_bank_details_components')
//                     .update({
                        
//                         branch_id: formValues.branch_id,
//                         component_name: formValues.componentName,
//                         data_type: formValues.componentDataType,
                       
//                     }).eq("id",formValues.component_id);
            
//             }
//             const { error } = await query;
//         if (error) {
//             setLoading(false)
//             console.log(error);
//             alert("Some error occured")
        
//         } else {
//             onClose();
//            setLoading(false)
//            alert(isComponentAdd?"Component added successfully":"Component updated successfully");
//         }
//         }catch(e){
//             console.log(e);
        
//         alert("Failed with exception")
//         }
       
//     }

//     return (
//         <div className="">
//             <div className="">
//                 <div className="row">
//                     <div className="col-lg-12" style={{ textAlign: "right" }}>
//                         <img src={staticIconsBaseURL+"/images/close.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "15px", paddingBottom: "5px", alignItems: "right" }}
//                             onClick={onClose} />
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12 mb-4 inner_heading25 text-center">
//                         {isComponentAdd?"Add Component" : "Update Component"}
//                     </div>
//                 </div>
//                 <form >

//                     <div className="row">

//                         <div className="col-md-12">
//                             <div className="form_box mb-3">
//                                 <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:  </label>
//                                 <Select
//                                     className="custom-select"
//                                     classNamePrefix="custom"
//                                     options={branchArray}
//                                     value={selectedBranch}
//                                     onChange={(selectedOption) =>
//                                         // handleEmployeeChange(selectedOption)
//                                         {
//                                         setSelectedBranch({value:selectedOption?.value||'',label:selectedOption?.label||''});
//                                         setFormValues((prev) => ({ ...prev, ['branch_id']: selectedOption?.value }))
//                                         }
//                                     }
//                                     placeholder="Search Branch"
//                                     isSearchable
//                                 />
//                                 {errors.branch_id && <span className="error" style={{color: "red"}}>{errors.branch_id}</span>}

//                             </div>
//                         </div>
//                         <div className="col-md-12">
//                             <div className="form_box mb-3">
//                                 <label htmlFor="exampleFormControlInput1" className="form-label" >{isComponentAdd?"Add Bank Component":"Update Bank Component"}:  </label>
//                                 <input type="text" className="form-control" value={formValues.componentName} name="componentName" onChange={(e) => setFormValues((prev) => ({ ...prev, ['componentName']: e.target.value }))} id="componentName" />
//                                 {errors.componentName && <span className="error" style={{color: "red"}}>{errors.componentName}</span>}
//                             </div>
//                         </div>
//                         <div className="col-md-12">
//                             <div className="form_box mb-3">
//                                 <label htmlFor="exampleFormControlInput1" className="form-label" > Component Data Type: </label>
//                                 <div className="form_box mb-3">
//                             <select id="componentDataType" name="componentDataType" value={formValues.componentDataType} onChange={(e) => setFormValues((prev) => ({ ...prev, ['componentDataType']: e.target.value }))}>
//                                 <option value="">Select</option>
//                                 {bankComponentDataType.map((type) => (
//                                     <option value={type.value} key={type.id}>{type.label}</option>
//                                 ))}
//                             </select>
//                             {errors.componentDataType && <span className="error" style={{color: "red"}}>{errors.componentDataType}</span>}
//                         </div> </div>
//                         </div>
//                     </div>
//                     <div className="row mb-3">
//                         <div className="col-lg-12 " style={{ textAlign: "center" }}>
//                             <input type='button' value={isComponentAdd?"Add" :"Update"} className="red_button" onClick={onAddClicked}/>
//                         </div>

//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default DialogAddEditBankComponents


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
import { bankComponentDataType, staticIconsBaseURL } from '../pro_utils/stringConstants';





const DialogAddEditBankComponents = ({ isComponentAdd,componentValue, onClose }: { onClose: () => void,isComponentAdd:boolean,componentValue:ClientBankComponentsDataModel }) => {
    const { contextClientID, contaxtBranchID } = useGlobalContext();
    const [formValues, setFormValues] = useState<BankComponentsAddEditForm>({
        branch_id:'',
        component_id: '',
        componentName: '',
        componentDataType: '',
    });
    const [isLoading, setLoading] = useState(false);
    const [branchArray, setBranchArray] = useState([{ value: '', label: '' }]);
    const [selectedBranch, setSelectedBranch] = useState({ value: '', label: '' });
    const [errors, setErrors] = useState<Partial<BankComponentsAddEditForm>>({});

    useEffect(() => {
        if(!isComponentAdd){
            setFormValues({
                branch_id:componentValue.branch_id,
                component_id:componentValue.id,
                componentName:componentValue.component_name,
                componentDataType:componentValue.data_type
            })
        }
        
        fetchData();
    }, [])

    const fetchData = async () => {


        setLoading(true);
        const branch = await getBranches(contextClientID);
        let extractBranch: any[] = []
        for (let i = 0; i < branch.length; i++) {

            extractBranch.push({
                value: branch[i].id,
                label: branch[i].branch_number,
            })
            if(componentValue.branch_id==branch[i].id){
                setSelectedBranch({value: branch[i].id,
                    label: branch[i].branch_number})
            }
        }

        setBranchArray(extractBranch);
        
    }
    const validate = () => {
        const newErrors: Partial<BankComponentsAddEditForm> = {};
        

        
        
        if (!formValues.branch_id) newErrors.branch_id = "required";
        if (!formValues.componentName) newErrors.componentName = "required";
        if (!formValues.componentDataType) newErrors.componentDataType = "required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const onAddClicked = async () => {
        if(!validate()) return;
        setLoading(true);
        try{
            let query;
        
            if (isComponentAdd) {
                query = supabase
                    .from('leap_client_bank_details_components')
                    .insert({
                        client_id: contextClientID,
                        branch_id: formValues.branch_id,
                        component_name: formValues.componentName,
                        data_type: formValues.componentDataType,
                        created_at:new Date()
                    });
            } else {
                query = supabase
                    .from('leap_client_bank_details_components')
                    .update({
                        
                        branch_id: formValues.branch_id,
                        component_name: formValues.componentName,
                        data_type: formValues.componentDataType,
                       
                    }).eq("id",formValues.component_id);
            
            }
            const { error } = await query;
        if (error) {
            setLoading(false)
            console.log(error);
            alert("Some error occured")
        
        } else {
            onClose();
           setLoading(false)
           alert(isComponentAdd?"Component added successfully":"Component updated successfully");
        }
        }catch(e){
            console.log(e);
        
        alert("Failed with exception")
        }
       
    }

    return (
        <div className="">
            <div className="">
                <div className='rightpoup_close' onClick={onClose}>
                    <img src={staticIconsBaseURL+"/images/close_white.png"} alt="Search Icon" title='Close'/>
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-4 inner_heading25">
                        {isComponentAdd?"Add Component" : "Update Component"}
                    </div>
                </div>
                <form >

                    <div className="row">

                        <div className="col-md-12">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:  </label>
                                <Select
                                    className="custom-select"
                                    classNamePrefix="custom"
                                    options={branchArray}
                                    value={selectedBranch}
                                    onChange={(selectedOption) =>
                                        // handleEmployeeChange(selectedOption)
                                        {
                                        setSelectedBranch({value:selectedOption?.value||'',label:selectedOption?.label||''});
                                        setFormValues((prev) => ({ ...prev, ['branch_id']: selectedOption?.value }))
                                        }
                                    }
                                    placeholder="Search Branch"
                                    isSearchable
                                />
                                {errors.branch_id && <span className="error" style={{color: "red"}}>{errors.branch_id}</span>}

                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >{isComponentAdd?"Add Bank Component":"Update Bank Component"}:  </label>
                                <input type="text" className="form-control" value={formValues.componentName} name="componentName" onChange={(e) => setFormValues((prev) => ({ ...prev, ['componentName']: e.target.value }))} id="componentName" />
                                {errors.componentName && <span className="error" style={{color: "red"}}>{errors.componentName}</span>}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" > Component Data Type: </label>
                                <div className="form_box mb-3">
                            <select id="componentDataType" name="componentDataType" value={formValues.componentDataType} onChange={(e) => setFormValues((prev) => ({ ...prev, ['componentDataType']: e.target.value }))}>
                                <option value="">Select</option>
                                {bankComponentDataType.map((type) => (
                                    <option value={type.value} key={type.id}>{type.label}</option>
                                ))}
                            </select>
                            {errors.componentDataType && <span className="error" style={{color: "red"}}>{errors.componentDataType}</span>}
                        </div> </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-lg-12">
                            <input type='button' value={isComponentAdd?"Add" :"Update"} className="red_button" onClick={onAddClicked}/>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default DialogAddEditBankComponents


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