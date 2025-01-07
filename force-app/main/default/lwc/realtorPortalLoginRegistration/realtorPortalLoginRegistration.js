import { LightningElement, track, wire } from 'lwc';
import logo from '@salesforce/resourceUrl/newlogo';
import registerUser from '@salesforce/apex/realtorPortalAuth.registerUser';
import doLogin from '@salesforce/apex/realtorPortalAuth.doLogin';

export default class realtorPortalResetPasswordWrapper extends LightningElement {
    logoPNG = logo;
    @track newPassword;
    @track confirmPassword;
    @track error = false;
    @track validPasswords = false;
    @track auth;
    @track token = 'test';
    @track submitDisabled = false;
    @track passError = undefined;
    @track confirmPassError = false;
    @track expired;
    @track validToken;
    @track username;
    @track loading;
    @track submitLoading = false;
    @track firstName;
    @track lastName;

    @track infoTooltipDisplayData = {};
    @track requiredTooltipDisplayData = {};
    @track errorTooltipDisplayData = {};

    // @wire(CurrentPageReference)
    // currentPageReference;

    // @wire(CurrentPageReference)
    // getToken(currentPageReference) {
    //     if (currentPageReference) {
    //         this.token = currentPageReference.state?.token;
    //     }
    // }

    connectedCallback() {
        this.infoTooltipDisplayData.username = "tooltiptext usernameTooltiptext";
        this.infoTooltipDisplayData.password = "tooltiptext";

        this.requiredTooltipDisplayData.firstName = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.lastName = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.email = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.phone = 'tooltiptext tooltipHide';

        this.requiredTooltipDisplayData.username = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.hearAboutUs = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.password = 'tooltiptext tooltipHide';
        this.requiredTooltipDisplayData.confirmPassword = 'tooltiptext tooltipHide';
        this.errorTooltipDisplayData.phone = 'tooltiptext tooltipHide';
        this.errorTooltipDisplayData.email = 'tooltiptext tooltipHide';
        this.errorTooltipDisplayData.password = 'tooltiptext tooltipHide';

        // this.loading = true;
        // validateUserToken({ token: this.token }).then(result => {
        //     this.auth = result;
        //     this.expired = false;
        //     this.validToken = true;
        //     this.loading = false;
        // }).catch(error => {
        //     console.log(error.body.message);
        //     this.expired = true;
        //     this.validToken = false;
        //     this.loading = false;
        // })
    }

    handleUserNameChange(event) {
        console.log('username change');
        this.userName = event.target.value;
        this.email = event.target.value;
    }

    handlePasswordChange(e){
 
        this.password = e.target.value;
    }

    handleConfirmPasswordChange(e){

        this.confirmPassword = e.target.value;
    }

    handleFirstNameChange(e){
        this.firstName = e.target.value;
    }

    handleLastNameChange(e){
        console.log('lastname');
        console.log(e.target.value);
        this.lastName = e.target.value;
    }

    @track errorCheck;

    async handleRegister(event) {
        console.log('reg');
        try{
        this.errorCheck = false;
        this.errorMessage = null;
        this.errorTooltipDisplayData.email = 'tooltiptext tooltipHide';
        this.errorTooltipDisplayData.password = 'tooltiptext tooltipHide';
        
        if (!this.email) {
            this.requiredTooltipDisplayData.email = 'tooltiptext tooltipShow';
        } else {
            this.requiredTooltipDisplayData.email = 'tooltiptext tooltipHide';
        }
        if (!this.userName) {
            this.requiredTooltipDisplayData.username = 'tooltiptext tooltipShow';
            this.infoTooltipDisplayData.username = "tooltiptext usernameTooltiptext tooltipHide";
        } else {
            this.requiredTooltipDisplayData.username = 'tooltiptext tooltipHide';
        }
        if (!this.firstName) {
            this.requiredTooltipDisplayData.firstName = 'tooltiptext tooltipShow';
        } else {
            this.requiredTooltipDisplayData.firstName = 'tooltiptext tooltipHide';
        }

        if (!this.lastName) {
            this.requiredTooltipDisplayData.lastName = 'tooltiptext tooltipShow';
        } else {
            this.requiredTooltipDisplayData.lastName = 'tooltiptext tooltipHide';
        }

        if (!this.password) {
            this.requiredTooltipDisplayData.password = 'tooltiptext tooltipShow';
            this.infoTooltipDisplayData.password = "tooltiptext tooltipHide";
        } else {
            this.requiredTooltipDisplayData.password = 'tooltiptext tooltipHide';
        }

        if (!this.confirmPassword) {
            this.requiredTooltipDisplayData.confirmPassword = 'tooltiptext tooltipShow';
        } else {
            this.requiredTooltipDisplayData.confirmPassword = 'tooltiptext tooltipHide';
        }



        if (this.firstName && this.lastName && this.email && this.userName && this.password && this.confirmPassword) {
            if (this.password != this.confirmPassword) {
                this.infoTooltipDisplayData.password = "tooltiptext tooltipHide";
                this.passwordError = 'Password did not match. Please Make sure both the passwords match.';
                this.errorTooltipDisplayData.password = 'tooltiptext tooltipShow tooltipError';
                event.preventDefault();
                this.showTermsAndConditionsLoading = false;
                return;
            }
            let emailCheck = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email);
            if (emailCheck == null || emailCheck == undefined || emailCheck == false) {
                this.showTermsAndConditionsLoading = false;
                this.emailError = 'Please enter a valid email address';
                this.errorTooltipDisplayData.email = 'tooltiptext tooltipShow tooltipError';
                return;
            }
            let passwordCheck;
            if(this.password.length >= 8){
                passwordCheck = true;
            }
            
            if (passwordCheck == null || passwordCheck == undefined || passwordCheck == false) {
                this.showTermsAndConditionsLoading = false;
                this.infoTooltipDisplayData.password = "tooltiptext tooltipHide";
                this.passwordError = 'Password must be Minimum eight characters.';
                this.errorTooltipDisplayData.password = 'tooltiptext tooltipShow tooltipError';
                return;
            }
            event.preventDefault();
            console.log('registering');
            console.log(this.email);
            await registerUser({firstName: this.firstName, lastName: this.lastName, username: this.userName, email: this.email, password: this.password,})
                .then((result) => {
                    console.log('complete');
                    if (result) {
                        window.location.href = result;
                    }
                    this.showTermsAndConditionsLoading = false;
                })
                .catch((error) => {
                    console.log('error');
                    console.log(JSON.stringify(error.body));
                    this.error = error;
                    this.showTermsAndConditionsLoading = false;
                    if (error && error.body && error.body.message) {
                        this.showTermsAndConditions = false;
                        this.errorCheck = true;
                        this.errorMessage = error.body.message;
                    }
                    
                });
            }
        }catch(error){
            console.log(error.message);
        }
        }

    passwordOnKeyUp(e){
        this.password = e.target.value;
    }

    confirmOnKeyUp(e){
        this.confirmPassword = e.target.value;
    }

    // handlePasswordChange() {
    //     this.checkPass(this.password);
    //     this.checkConfirmPass();
    // }

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
                this.handleRegister();
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