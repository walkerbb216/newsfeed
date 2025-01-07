import { LightningElement, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import RealtorPortalMC from '@salesforce/messageChannel/RealtorPortalMC__c';
import Id from "@salesforce/user/Id";

export default class RealtorPortalNav extends LightningElement {
    userId = Id;

    @track brett;

    @wire(MessageContext)
    messageContext;

    handleNav(e) {

        let dataId = e.target.getAttribute('data-id');
        try{
        const selectedEvent = new CustomEvent("navclick", {
            detail: dataId
        })
        this.dispatchEvent(selectedEvent);
        this.publishMessage();
        this.closeMenu();
    }catch(error){
        console.log(error.message);
    }
        let blah = this.template.querySelectorAll("[data-type='nav']");
        console.log('bl;ah');
        console.log(blah);
        blah.forEach(element =>{
            try{
                            
            console.log(element);
            console.log(element.getAttribute('data-id'));
            if(element.getAttribute('data-id') == dataId){
                element.classList.add('bg-gray-50', 'text-indigo-600');
            }else{
                
                element.classList.remove('bg-gray-50', 'text-indigo-600');
            }
        }catch(error){
            console.log(error.message);
        }

        })
    }

    showMenu() {
        let menu = this.template.querySelector('.mobile');
        if (menu.className.includes('hidden')) {
            menu.className = 'mobile';
        } else {
            this.closeMenu();
        }
    }

    closeMenu() {
        try{
        let menu = this.template.querySelector('.mobile');
        menu.className = 'mobile hidden';
        }catch(error){
            console.log(error.message);
        }
    }

    connectedCallback() {
        if (this.userId == '005Pd000001KuK1IAK') {
            this.brett = true;
        }
    }

    publishMessage() {
        try {
            let message = { message: false };
            publish(this.messageContext, RealtorPortalMC, message);
        } catch (error) {
        }
    }
}