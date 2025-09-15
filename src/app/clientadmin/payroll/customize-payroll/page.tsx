'use client'
import React from 'react'
import LeapHeader from '@/app/components/header'
import LeftPannel from '@/app/components/leftPannel'
import Footer from '@/app/components/footer'
import LoadingDialog from '@/app/components/PageLoader'
import { useEffect, useState } from 'react'
import supabase from '@/app/api/supabaseConfig/supabase'
import { leftMenuCompanyPayrollPageNumbers, leftMenuPayrollSub2PageNumbers } from '@/app/pro_utils/stringRoutes'
import AddSalaryComponent from '@/app/components/dialog_addSalaryComponent'
import { addDeductionComponentTitle, addEarningComponentTitle, deleteDataTypeSalaryComponent, staticIconsBaseURL, updateEarningComponentTitle } from '@/app/pro_utils/stringConstants'
import { useGlobalContext } from '@/app/contextProviders/loggedInGlobalContext'
import UpdateSalaryComponent from '@/app/components/dialog_updateSalaryComponent'
import DeleteConfirmation from '@/app/components/dialog_deleteConfirmation'
import ShowAlertMessage from '@/app/components/alert'

const CustomizePayrollComponents = () => {


    const [scrollPosition, setScrollPosition] = useState(0);
    const [showAddComponentDialog, setShowComponentDialog] = useState(false);
    const [showUpdateComponentDialog, setShowUpdateComponentDialog] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [addComponentDialogtitle, setShowComponentDialogTitle] = useState("");
    const [updateComponentDialogtitle, setupdateComponentDialogTitle] = useState("");
    const { contextClientID, contextCustomerID, contextRoleID } = useGlobalContext();
    const [branchArray, setBranchArray] = useState<LeapBranchesNameID[]>([]);
    const [deleteComponentID, setDeleteComponentID] = useState(0);
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');

    const [editComponentData, setEditComponentData] = useState<UpdateComponentDataModel>({
        isAddComponent: false,
        main_component_id: 0,
        client_component_id: 0,
        branch_id: 0,
        pay_accural: '',
        enabled: false,
        isOtherComponentByClient: false,
    });
    const [earningComponentsArray, setEarningComponentsArray] = useState<LeapClientSalaryComponents[]>([]);
    const [deuctionComponentsArray, setDeuctionComponentsArray] = useState<LeapClientSalaryComponents[]>([]);
    const [brancheIDFilter, setBrancheIDFilter] = useState<number | null>(null);

    useEffect(() => {
        const fetchBranches = async () => {

            const branches = await getBranches(contextClientID);
            

            if (branches.length > 0) {
                setBranchArray(branches);
                setBrancheIDFilter(branches[0].id);
                fetchData(branches[0].id);
            }else{
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get data");
                setAlertForSuccess(2)
            }
        };
        fetchBranches();
        const handleScroll = () => {
            setScrollPosition(window.scrollY); // Update scroll position
            const element = document.querySelector('.mainbox');
            if (window.pageYOffset > 0) {
                element?.classList.add('sticky');
            } else {
                element?.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {

            window.removeEventListener('scroll', handleScroll);
        };

    }, [])


    const fetchData = async (branchID: any) => {
        setLoading(true);
        setBrancheIDFilter(branchID);

        try {

            const formData = new FormData();
            formData.append("client_id", contextClientID);
            formData.append("branch_id", branchID.toString());

            const res = await fetch("/api/clientAdmin/payroll/fetch_payroll_component", {
                method: "POST",
                body: formData,
            });
            const response = await res.json();

            if (response.status === 1) {
                setLoading(false);
                setEarningComponentsArray(response.data.earningComponents);
                setDeuctionComponentsArray(response.data.deductionComponents);

            } else {
                setLoading(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get data");
                setAlertForSuccess(2)
            }
        } catch (error) {
            setLoading(false);
            setShowAlert(true);
            setAlertTitle("Exception")
            setAlertStartContent("Failed to create leave type");
            setAlertForSuccess(2)
            console.error("Error fetching holidays:", error);

        }

    }



    return (
        <div className='mainbox'>
            <header>
                <LeapHeader title="Welcome!" />
            </header>
            <LeftPannel menuIndex={leftMenuCompanyPayrollPageNumbers} subMenuIndex={leftMenuPayrollSub2PageNumbers} showLeftPanel={true} rightBoxUI={

                <div>
                    <LoadingDialog isLoading={isLoading} />
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                        setShowAlert(false)
                    }} onCloseClicked={function (): void {
                        setShowAlert(false)
                    }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    <div className='container'>
                        <div className="row heading25 mb-3">
                            <div className="col-lg-6">
                                Payroll <span>Customization</span>
                            </div>
                        </div>



                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row mb-5">

                                    <div className="grey_box">
                                        <div className="row settings-title-bg">
                                            <div className="col-lg-11 settings_title">Earning Components</div>
                                            <div className="col-lg-1 settings_button" onClick={() => { setShowComponentDialog(true); setShowComponentDialogTitle(addEarningComponentTitle) }}>Add</div>
                                        </div>
                                        <div className="row">
                                            {branchArray.map((branch) => (
                                                <div className={brancheIDFilter === branch.id ? "list_view_box_selected" : "list_view_box"}
                                                    key={branch.id}
                                                    style={{ width: "15%", margin: "10px 10px 10px 0" }} >

                                                    <a onClick={() => fetchData(branch.id)}>
                                                        <div className={brancheIDFilter === branch.id ? "selected text-center" : "list_view_heading text-center"}>
                                                            {branch.branch_number}
                                                        </div>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12 mt-5">
                                                <div className="grey_box" style={{ backgroundColor: "#fff" }}>
                                                    <div className="row list_label mb-4">
                                                        <div className="col-lg-3 text-center"><div className="label">Component Name</div></div>
                                                        <div className="col-lg-3 text-center"><div className="label">Payable Type</div></div>
                                                        <div className="col-lg-2 text-center"><div className="label">Enabled</div></div>
                                                    </div>

                                                    {earningComponentsArray.length > 0 ? (
                                                        earningComponentsArray.map((component) => (
                                                            <div className="row list_listbox" key={component.id}>
                                                                <div className="col-lg-3 text-center"><b>{component.leap_salary_components.salary_component_name}</b></div>
                                                                <div className="col-lg-3 text-center">{component.leap_salary_payable_days.payable_time}</div>
                                                                <div className="col-lg-2 text-center">{component.is_active + ""}</div>
                                                                <div className="col-lg-1 text-center">
                                                                    <img src={staticIconsBaseURL + "/images/edit.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
                                                                        onClick={() => {

                                                                            setEditComponentData({
                                                                                isAddComponent: true,
                                                                                branch_id: component.branch_id,
                                                                                client_component_id: component.id,
                                                                                main_component_id: component.leap_salary_components.id,
                                                                                pay_accural: component.leap_salary_payable_days.id,
                                                                                enabled: component.is_active,
                                                                                isOtherComponentByClient: component.leap_salary_components.is_other_component_client_id ? true : false,

                                                                            });
                                                                            setupdateComponentDialogTitle(updateEarningComponentTitle)
                                                                            setShowUpdateComponentDialog(true);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-1 text-center">
                                                                    <img src={staticIconsBaseURL + "/images/delete.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
                                                                        onClick={() => {
                                                                            setDeleteComponentID(component?.id);
                                                                            setShowDeleteConfirmationDialog(true);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center">No Components Added</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-5">

                                    <div className="grey_box">
                                        <div className="row settings-title-bg">

                                            <div className="col-lg-11 settings_title">Deduction Components</div>
                                            <div className="col-lg-1 settings_button" onClick={() => { setShowComponentDialog(true); setShowComponentDialogTitle(addDeductionComponentTitle) }}>Add</div>


                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12 mt-5">
                                                <div className="grey_box" style={{ backgroundColor: "#fff" }}>
                                                    <div className="row list_label mb-4">
                                                        <div className="col-lg-3 text-center"><div className="label">Component Name</div></div>
                                                        <div className="col-lg-3 text-center"><div className="label">Payable Type</div></div>
                                                        <div className="col-lg-2 text-center"><div className="label">Enabled</div></div>
                                                    </div>

                                                    {deuctionComponentsArray.length > 0 ? (
                                                        deuctionComponentsArray.map((deductionComponent) => (
                                                            <div className="row list_listbox" key={deductionComponent.id}>
                                                                <div className="col-lg-3 text-center"><b>{deductionComponent.leap_salary_components.salary_component_name}</b></div>
                                                                <div className="col-lg-3 text-center">{deductionComponent.leap_salary_payable_days.payable_time}</div>
                                                                <div className="col-lg-2 text-center">{deductionComponent.is_active}</div>
                                                                <div className="col-lg-1 text-center">
                                                                    <img src={staticIconsBaseURL + "/images/edit.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
                                                                        onClick={() => {
                                                                            setEditComponentData({
                                                                                isAddComponent: true,
                                                                                branch_id: deductionComponent.branch_id,
                                                                                client_component_id: deductionComponent.id,
                                                                                main_component_id: deductionComponent.leap_salary_components.id,
                                                                                pay_accural: deductionComponent.leap_salary_payable_days.id,
                                                                                enabled: deductionComponent.is_active,
                                                                                isOtherComponentByClient: deductionComponent.leap_salary_components.is_other_component_client_id ? true : false,
                                                                            });
                                                                            setupdateComponentDialogTitle(updateEarningComponentTitle)
                                                                            setShowUpdateComponentDialog(true);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-1 text-center">
                                                                    <img src={staticIconsBaseURL + "/images/delete.png"} className="img-fluid edit-icon" alt="Search Icon" style={{ width: "20px", paddingBottom: "5px", alignItems: "center" }}
                                                                        onClick={() => {
                                                                            setDeleteComponentID(deductionComponent?.id);
                                                                            setShowDeleteConfirmationDialog(true);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center">No Components Added</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={showAddComponentDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showAddComponentDialog && <AddSalaryComponent onClose={() => { setShowComponentDialog(false); fetchData(brancheIDFilter) }} title={addComponentDialogtitle} branchID={brancheIDFilter} />}
                    </div>
                    <div className={showUpdateComponentDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showUpdateComponentDialog && <UpdateSalaryComponent onClose={() => { setShowUpdateComponentDialog(false); fetchData(brancheIDFilter) }} title={addComponentDialogtitle} componentData={editComponentData} />}
                    </div>
                    <div className={showDeleteConfirmationDialog ? "rightpoup rightpoupopen" : "rightpoup"}>
                        {showDeleteConfirmationDialog && <DeleteConfirmation id={deleteComponentID} deletionType={deleteDataTypeSalaryComponent} onClose={() => { setShowDeleteConfirmationDialog(false), fetchData(brancheIDFilter) }} deleteDetail={''} />}
                    </div>



                </div>



                //  : <LoadingDialog isLoading={true} />
            } />
            {/* </div> */}

            <div>
                <Footer />
            </div>
        </div>
    )
}

export default CustomizePayrollComponents;

async function getBranches(clientID: any) {
    const { data, error } = await supabase.from("leap_client_branch_details")
        .select("id,branch_number")
        .eq("client_id", clientID);
    if (error) {
        return []
    } else {
        return data
    }


}
