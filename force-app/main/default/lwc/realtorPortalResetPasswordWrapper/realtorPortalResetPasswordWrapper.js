import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import logo from '@salesforce/resourceUrl/newlogo';
import validateUserToken from '@salesforce/apex/realtorPortalAuth.validateResetToken';
import updatePassword from '@salesforce/apex/realtorPortalAuth.updateUserPassword';
import doLogin from '@salesforce/apex/realtorPortalAuth.doLogin';

export default class realtorPortalResetPasswordWrapper extends LightningElement {
    logoPNG = logo;
    @track newPassword;
    @track confirmPassword;
    @track error = false;
    @track validPasswords = false;
    @track auth;
    @track token = 'test';
    @track submitDisabled = true;
    @track passError = undefined;
    @track confirmPassError = false;
    @track expired;
    @track validToken;
    @track username;
    @track loading;
    @track submitLoading = false;

    @wire(CurrentPageReference)
    currentPageReference;

    @wire(CurrentPageReference)
    getToken(currentPageReference) {
        if (currentPageReference) {
            this.token = currentPageReference.state?.token;
        }
    }

    connectedCallback() {
        this.loading = true;
        validateUserToken({ token: this.token }).then(result => {
            this.auth = result;
            this.expired = false;
            this.validToken = true;
            this.loading = false;
        }).catch(error => {
            console.log(error.body.message);
            this.expired = true;
            this.validToken = false;
            this.loading = false;
        })
    }

    passwordOnKeyUp(e){
        this.password = e.target.value;
    }

    confirmOnKeyUp(e){
        this.confirmPassword = e.target.value;
    }

    handlePasswordChange() {
        this.checkPass(this.password);
        this.checkConfirmPass();
    }

    checkPass(pass) {
        let passLength = pass.split("").length;
        let passTest = /^(\d+[a-zA-Z]|[a-zA-Z]+\d)(\d|[a-zA-Z])*/mg.test(pass);
        if (passLength < 8) {
            this.passError = 'Password must be at least 8 characters long.'
            return false;
        } else if (passTest == null || passTest == undefined || passTest == false) {
            this.passError = 'Password must have at least 1 letter and 1 number';
            return false;
        } else {
            this.passError = undefined;
            return true;
        }
    }

    checkConfirmPass() {
        if (this.confirmPassword) {
            if (this.confirmPassword !== this.password) {
                this.confirmPassError = 'Passwords must match.'
                this.validPasswords = false;
            } else {
                this.confirmPassError = undefined;
                this.validPasswords = this.checkPass(this.password, this.passError);
            }

            if (this.validPasswords === true) {
                this.disableButton(false);
            } else {
                this.disableButton(true);
            }
        }
    }

    handleEnter(e) {
        if (e.keyCode === 13) {
            this.error = undefined;
            this.checkConfirmPass();
            if(this.validPasswords){
                this.handleSubmit();
                return;
            }
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

    handleError(err) {
        if (err.includes("UNKNOWN_EXCEPTION") || err.includes("INVALID_NEW_PASSWORD")) {
            return err.split(": ")[1];
        } else {
            return err;
        }
    }

    async handleSubmit() {
        this.error = undefined;
        this.disableButton(true);
        this.submitLoading = true;
        await updatePassword({ token: this.token, auth: this.auth, password: this.password }).then(result => {
            this.username = result;
            doLogin({ username: this.username, password: this.password }).then((result) => {
                window.location.href = result;
            }).catch((error) => {
                this.disableButton(false);
                console.log(error.body.message);
                this.error = this.handleError(error.body.message);
                this.submitLoading = false;
            });

        }).catch(error => {
            this.disableButton(false);
            this.submitLoading = false;
            console.log(error.body.message);
            this.error = this.handleError(error.body.message);
        })
    }
}