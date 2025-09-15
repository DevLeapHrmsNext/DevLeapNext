import React, { useEffect, useState } from 'react'
import supabase from '../api/supabaseConfig/supabase';
import Select from "react-select";
import { useGlobalContext } from '../contextProviders/loggedInGlobalContext';
import { addEarningComponentTitle, ALERTMSG_exceptionString, staticIconsBaseURL } from '../pro_utils/stringConstants';
import LoadingDialog from './PageLoader';
import ShowAlertMessage from './alert';


interface ComponentForm {
    component_ID: string,
    other_component: string,
    pay_accural: string,
    enabled: boolean,

}

const AddSalaryComponent = ({ title, branchID, onClose }: { title: any, branchID: any, onClose: () => void }) => {

    const [selectedComponent, setSelectedComponent] = useState(null);
    const [componentName, setComponentName] = useState([{ value: '', label: '' }]);
    const [showAddOtherOption, setShowOtherOption] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { contextClientID, contaxtBranchID, contextRoleID, contextCustomerID } = useGlobalContext();
    const [branchArray, setBranchArray] = useState<ClientBranchTableModel>();
    const [payAccuralArray, setPayAccuralArray] = useState<PayAccuralTable[]>([]);
    const [formValues, setFormValues] = useState<ComponentForm>({
        component_ID: '',
        other_component: '',
        pay_accural: '',
        enabled: false,
    });

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const allComponents = await getComponents(contextClientID);
            let components: any[] = []
            for (let i = 0; i < allComponents.length; i++) {
                components.push({
                    value: allComponents[i].id,
                    label: allComponents[i].salary_component_name,
                })

            }
            components.push({
                value: "-1",
                label: "Other",
            })
            setComponentName(components)
            const accurals = await getPayAccuralArray();
            setPayAccuralArray(accurals);
            const branch = await getBranches(contextClientID, branchID);
            setBranchArray(branch);


        };
        fetchData();
    }, []);

    const handleComponentSelectChange = async (values: any) => {
        setSelectedComponent(values)
        setFormValues((prev) => ({ ...prev, ["component_ID"]: values.value }));

        if (values.value == "-1") {
            setShowOtherOption(true);
        } else {
            setShowOtherOption(false);
        }
    };
    const handleFormValuesChange = async (e: any) => {
        const { name, value } = e.target;
        console.log(name);

        setFormValues((prev) => ({ ...prev, [name]: value }));

    };
    const [errors, setErrors] = useState<Partial<ComponentForm>>({});

    const validate = () => {
        const newErrors: Partial<ComponentForm> = {};
        if (!formValues.component_ID) newErrors.component_ID = "required";
        if (!formValues.pay_accural) newErrors.component_ID = "required";
        if (!formValues.enabled) newErrors.component_ID = "required";
        if (!formValues.component_ID && formValues.component_ID == "-1" && !formValues.other_component) newErrors.component_ID = "required";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const AddComponent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true)
        const formData = new FormData();
        formData.append("client_id", contextClientID);
        formData.append("branch_id", branchID);
        formData.append("component_ID", formValues.component_ID);
        formData.append("pay_accural_id", formValues.pay_accural);
        formData.append("other_component", formValues.other_component);
        formData.append("enabled", formValues.enabled + "");
        formData.append("is_add_component", title == addEarningComponentTitle ? "True" : "False");

        try {
            const res = await fetch("/api/clientAdmin/payroll/add_payroll_component", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();
            console.log(response);

            if (response.status == 1) {
                setLoading(false)
                setShowAlert(true);
                setAlertTitle("Success")
                setAlertStartContent(response.message);
                setAlertForSuccess(1)

            } else {
                setLoading(false)
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent(response.message);
                setAlertForSuccess(2)
            }
        } catch (e) {
            setLoading(false)
            console.log(e);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent(ALERTMSG_exceptionString);
            setAlertForSuccess(2)

        }


    }

    return (
        <>
            <div className="">
                <LoadingDialog isLoading={isLoading} />
                {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                    setShowAlert(false)
                    onClose();
                }} onCloseClicked={function (): void {
                    setShowAlert(false)
                }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                <div className='rightpoup_close' onClick={onClose}>
                    <img src={staticIconsBaseURL + "/images/close_white.png"} alt="Search Icon" title='Close' />
                </div>
                <div className="row">
                    <div className="col-lg-12 mb-3 inner_heading25">
                        {title}
                    </div>
                </div>

                <form onSubmit={AddComponent}>

                    <div className="row mb-2">
                        <div className={showAddOtherOption ? "col-md-4" : "col-md-6"}>
                            <div className="form_box_no_font_size mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Branch:</label>
                                <label className="form-label font20Red" >{branchArray?.branch_number}</label>

                            </div>
                        </div>
                        <div className={showAddOtherOption ? "col-md-4" : "col-md-6"}>
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Component Name</label>

                                <Select
                                    value={selectedComponent}
                                    options={componentName}
                                    onChange={(selectedOption) =>
                                        handleComponentSelectChange(selectedOption)
                                    }
                                    placeholder="Select..."
                                    isSearchable
                                />

                            </div>
                            {errors.component_ID && <span className="error" style={{ color: "red" }}>{errors.component_ID}</span>}

                        </div>
                        {showAddOtherOption && <div className="col-md-4">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Other Name</label>
                                <input type="text" className="form-control" name="other_component" onChange={(e) => setFormValues((prev) => ({ ...prev, ['other_component']: e.target.value }))} id="other_component" />
                                {errors.other_component && <span className="error" style={{ color: "red" }}>{errors.other_component}</span>}
                            </div>
                        </div>}

                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Pay accural</label>
                                <select id="pay_accural" name="pay_accural" onChange={handleFormValuesChange}>
                                    <option value="">Select</option>
                                    {payAccuralArray.map((accural) => (
                                        <option value={accural.id} key={accural.id} >{accural.payable_time}</option>
                                    ))}
                                </select>
                                {errors.pay_accural && <span className="error" style={{ color: "red" }}>{errors.pay_accural}</span>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form_box mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label" >Enabled</label>
                                <select id="enabled" name="enabled" onChange={handleFormValuesChange}>
                                    <option value="" >Select</option>
                                    <option value="True" >True</option>
                                    <option value="False" >False</option>

                                </select>
                                {errors.enabled && <span className="error" style={{ color: "red" }}>{errors.enabled}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-lg-12 " style={{ textAlign: "center" }}>
                            <input type='submit' value="Add Component" className={isLoading ? "red_button loading" : "red_button"} />
                        </div>
                    </div>
                </form>
            </div>

        </>
    )
}

export default AddSalaryComponent

async function getComponents(client_id: any) {
    const { data, error } = await supabase.from("leap_salary_components")
        .select("*").or(`is_other_component_client_id.eq.${client_id},is_other_component_client_id.is.null`);
    if (error) {
        return []
    } else {
        return data
    }
}

async function getPayAccuralArray() {
    const { data, error } = await supabase.from("leap_salary_payable_days")
        .select("id,payable_time")
    if (error) {
        return []
    } else {
        return data
    }
}
async function getBranches(clientID: any, branchID: any) {

    let query = supabase
        .from('leap_client_branch_details')
        .select("*").eq("client_id", clientID).eq("id", branchID);
    const { data, error } = await query;
    if (error) {
        return null;
    } else {
        return data[0];
    }

}