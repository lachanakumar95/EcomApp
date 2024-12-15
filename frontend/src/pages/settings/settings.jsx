import React, {useState} from 'react';
//Primereact
import { TabView, TabPanel } from 'primereact/tabview';
// import { Stepper } from 'primereact/stepper';
// import { StepperPanel } from 'primereact/stepperpanel';
import GeneralInfo from './GeneralInfo';
import CompanyDetails from './CompanyDetails';
import Metatitle from './Metatitle';
import Aboutus from './Aboutus';
import Policy from './Policy';
import Contactus from './Contactus';
import LoginConfig from './LoginConfig';
function settings() {
    const [activeIndex, setActiveIndex] = useState(0);
    const handleTabChange = (e) => {
        setActiveIndex(e.index);
        console.log("Tab changed to:", e.index); // Logs the active tab index
        // Force scroll with a timeout
        setTimeout(() => {
            document.documentElement.scrollTop = 0; // Modern browsers
            document.body.scrollTop = 0; // Legacy fallback
        }, 0);
    };

  return (
    <>
   <div className="page_title" style={{marginTop: '20px', marginBottom: "10px"}}>Settings</div>
   {/* <Stepper orientation='vertical'>
        <StepperPanel header="General Information">
        <GeneralInfo/>
        </StepperPanel>
        <StepperPanel header="Company Details">
        <CompanyDetails/>
        </StepperPanel>
        <StepperPanel header="Meta content">
        <Metatitle/>
        </StepperPanel>
        <StepperPanel header="About Us">
        <Aboutus/>
        </StepperPanel>
        <StepperPanel header="Contact Us">
        <Contactus/>
        </StepperPanel>
        <StepperPanel header="Policy Management">
        <Policy/>
        </StepperPanel>
    </Stepper> */}
       <TabView scrollable activeIndex={activeIndex} onTabChange={handleTabChange}>
                <TabPanel header="General" leftIcon="pi pi-calendar mr-2">
                <GeneralInfo/>
                </TabPanel>
                <TabPanel header="Company" leftIcon="pi pi-user ml-2">
                   <CompanyDetails/>
                </TabPanel>
                <TabPanel header="Meta content" leftIcon="pi pi-search mr-2">
                   <Metatitle/>
                </TabPanel>
                <TabPanel header="About Us" leftIcon="pi pi-search mr-2">
                   <Aboutus/>
                </TabPanel>
                <TabPanel header="Contact Us" leftIcon="pi pi-search mr-2">
                   <Contactus/>
                </TabPanel>
                <TabPanel header="Policy" leftIcon="pi pi-search mr-2">
                   <Policy/>
                </TabPanel>
                <TabPanel header="login Config" leftIcon="pi pi-search mr-2">
                  <LoginConfig/>
                </TabPanel>
                
            </TabView>
    </>
  )
}

export default settings
