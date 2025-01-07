import { LightningElement } from 'lwc';

import POMPANO_POLICY from "@salesforce/resourceUrl/DPAPompanoPolicy";
import POMPANO_FLYER from "@salesforce/resourceUrl/DPAPompanoFlyer";
import POMPANO_INFO from "@salesforce/resourceUrl/DPAPompanoInfo";
import POMPANO_LENDER_POLICY from "@salesforce/resourceUrl/DPAPompanoLenderPolicy";
import POMPANO_DOCLIST from "@salesforce/resourceUrl/DPAPompanoDocChecklist";
import POMPANO_HUD from "@salesforce/resourceUrl/DPAPompanoHUD";
import POMPANO_INTAKE from "@salesforce/resourceUrl/DPAPompanoIntake";
import POMPANO_ELIGIBILITY from "@salesforce/resourceUrl/DPAPompanoEligibility";

import ORANGE_FLYER from "@salesforce/resourceUrl/DPAOrangeFlyer";
import ORANGE_INFO from "@salesforce/resourceUrl/DPAOrangeInfo";
import ORANGE_LENDER from "@salesforce/resourceUrl/DPAOrangeLender";
import ORANGE_RELEASE from "@salesforce/resourceUrl/DPAOrangeRelease";

import BREVARD_ELIGIBILITY from "@salesforce/resourceUrl/DPABrevardEligibility";
import BREVARD_CHECKLIST from "@salesforce/resourceUrl/DPABrevardChecklist";


export default class RealtorPortaldpa extends LightningElement {

    
    pompanoPolicy = POMPANO_POLICY;
    pompanoFlyer = POMPANO_FLYER;
    pompanoInfo = POMPANO_INFO;
    pompanoLenderPolicy = POMPANO_LENDER_POLICY;
    pompanoDocList = POMPANO_DOCLIST;
    pompanoHUD = POMPANO_HUD;
    pompanoIntake = POMPANO_INTAKE;
    pompanoEligibility = POMPANO_ELIGIBILITY;

    orangeFlyer = ORANGE_FLYER;
    orangeInfo = ORANGE_INFO;
    orangeLender = ORANGE_LENDER;
    orangeRelease = ORANGE_RELEASE;

    brevardEligibilty = BREVARD_ELIGIBILITY;
    brevardChecklist = BREVARD_CHECKLIST;
    connectedCallback(){
        console.log(this.orangeFlyer);
    }

}