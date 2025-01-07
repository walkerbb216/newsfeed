import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import PORTALMC from '@salesforce/messageChannel/portalMessageChannel__c';
import postLog from '@salesforce/apex/realtorPortal.postLog';
import Id from "@salesforce/user/Id";


export default class Wrapper extends LightningElement {
    userId = Id;
    @track navzindex = 'z-index:30;';
    @track sidezindex = 'z-index:20';
    @track sideNavCss = 'hidden lg:block';
    @track navBackdropClass = 'backdropHidden';
    @track hve;
    @track marketingPage;
    @track newMarketingKit;
    @track classPortal;
    @track brett;
    @track dpa;
    @track newsfeed = true;

    @wire(MessageContext)
    messageContext;

    handleSubscribe() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, PORTALMC, (message) => {
            this.publisherMessage = message.message;
            if (this.publisherMessage == true) {
                this.navzindex = 'z-index:0;'
                this.sidezindex = 'z-index:-1;'
            }
            else if (this.publisherMessage == false) {
                this.navzindex = 'z-index:30;'
                this.sidezindex = 'z-index:20;'
            }
        })
    }

    async connectedCallback() { 
        this.postLogEntry('mounted');
        this.handleSubscribe();
        if(this.userId == '005Pd000001KuK1IAK'){
            this.brett = true;
        }
    }

    handleBackdrop() {
        this.sideNavCss = 'hidden lg:block';
        this.navBackdropClass = 'backdropHidden';
    }

    openSideBar() {
        if (this.sideNavCss === 'hidden lg:block') {
            this.sideNavCss = 'sideNavVisible';
            this.navBackdropClass = 'backdrop';
        } else {
            this.sideNavCss = 'hidden lg:block';
            this.navBackdropClass = 'backdropHidden';
        }
    }

    closeSideBar() {
        this.sideNavCss = 'hidden lg:block';
        this.navBackdropClass = 'backdropHidden';
    }

    postLogEntry(type, logString){
        postLog({type: type, component:  this.template.host.localName, logString: logString});
    }

    handleNav(e){
        if(e.detail === 'hve'){            
            this.classPortal = false;
            this.hve = true;
            this.marketingPage = false;
            this.newMarketingKit = false;
            this.dpa = false;
            this.newsfeed = false;
        }
        if(e.detail === 'marketingkits'){
            this.classPortal = false;
            this.hve = false;
            this.marketingPage = true;
            this.newMarketingKit = false;
            this.dpa = false;
            this.newsfeed = false;
        }
        if(e.detail === 'classPortal'){
            this.classPortal = true;
            this.hve = false;
            this.marketingPage = false;
            this.newMarketingKit = false;
            this.dpa = false;
            this.newsfeed = false;
        }
        if(e.detail === 'dpa'){
            this.dpa = true;
            this.classPortal = false;
            this.hve = false;
            this.marketingPage = false;
            this.newMarketingKit = false;
            this.newsfeed = false;
        }
        if(e.detail === 'newsfeed'){
            this.newsfeed = true;
            this.dpa = false;
            this.classPortal = false;
            this.hve = false;
            this.marketingPage = false;
            this.newMarketingKit = false;

        }
        
    }

    openNewKit(){
        this.marketingPage = false;
        this.newMarketingKit = true;
    }

    backToList(){
        this.marketingPage = true;
        this.newMarketingKit = false;
    }
}