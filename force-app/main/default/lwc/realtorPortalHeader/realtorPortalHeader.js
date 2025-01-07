import { LightningElement } from 'lwc';
import LOGO from '@salesforce/resourceUrl/newlogo';
import basePath from '@salesforce/community/basePath';

export default class RealtorPortalHeader extends LightningElement {
    
    luxelogo = LOGO;
    get logoutLink() {
        const sitePrefix = basePath.replace(/\/s$/i, "");
        localStorage.removeItem('realtorloginwrapper1');
        localStorage.removeItem('realtorloginwrapper2');
        return sitePrefix + "/secur/logout.jsp";
    }
}