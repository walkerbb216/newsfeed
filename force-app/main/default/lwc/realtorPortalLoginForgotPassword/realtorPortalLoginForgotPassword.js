import { LightningElement, track } from 'lwc';
import logo from '@salesforce/resourceUrl/newlogo';
import sendForgotPasswordEmail from '@salesforce/apex/realtorPortalAuth.sendForgotPasswordEmail';

export default class RealtorPortalLoginForgotPassword extends LightningElement {
    logoPNG = logo;
    @track submitted = false;
    @track validEmail;
    @track errorCheck;
    @track submitDisabled;
    @track error;
    @track errorMessage;
    @track userName;

    handleEnter(e) {
        if (e.keyCode === 13) {
            this.handleSubmit();
        }
    }

    disableButton(bool) {
        let button = this.template.querySelector('.loginBtn');
        if (bool == true) {
            button.classList.add('disabledButton');
            this.submitDisabled = true;
            return;
        }
        button.classList.remove('disabledButton');
        this.submitDisabled = false;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleSubmit(){
        this.disableButton(true);
        this.submitted = true;
        sendForgotPasswordEmail({email: this.email}).then((result) => {
        }).catch(error => {
            console.log(error.body.message);
            this.disableButton(false);
        })
    }

    goBack(){
        let selectedEvent = new CustomEvent("back");
        this.dispatchEvent(selectedEvent);
    }
}