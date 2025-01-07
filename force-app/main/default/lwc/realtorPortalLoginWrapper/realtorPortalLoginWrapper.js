import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import doLogin from '@salesforce/apex/realtorPortalAuth.doLogin';
import isEmailExist from '@salesforce/apex/realtorPortalAuth.isEmailExist';
import checkSession from '@salesforce/apex/realtorPortal.checkSession';
import logo from '@salesforce/resourceUrl/newlogo';


function setValue(name, value) {
    localStorage.setItem(name, value);
}

function getValue(name) {
    return localStorage.getItem(name);
}

export default class bpV2OriginatorLogin extends LightningElement {
    username;
    password;
    logoPNG = logo;
    @track validEmail;
    @track email = null;
    @track userName = null;
    @track password = null;
    @track errorCheck;
    @track errorMessage;
    @track inputType = 'password';
    @track urlOriginator;
    @track loginForm = true;
    @track submitDisabled = false;
    @track selfRegister = '/s/login/SelfRegister'
    @track forgotPassword = false;
    @track submitLoading = false;
    urlOriginator;
    urlId;
    @wire(CurrentPageReference)
    currentPageReference;
    @track register;

    reg(){
        this.loginForm = false;
        this.register = true;
    }

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.urlId = currentPageReference.state?.id;
            this.urlOriginator = currentPageReference.state?.originator;
        }
    }

    async connectedCallback() {
        if (typeof this.urlOriginator != 'undefined') {
            this.selfRegister = '/s/login/SelfRegister/?originator=' + this.urlOriginator;
        }
        
        var meta = document.createElement("meta");
        meta.setAttribute("name", "viewport");
        meta.setAttribute("content", "width=device-width, initial-scale=1.0");
        document.getElementsByTagName('head')[0].appendChild(meta);
        try{
                    await checkSession().then(
            data => {
                console.log('data');
                if (data == 'active') {
                    window.location.href = 'https://realtor.luxemtg.com';
                }
            }).catch(error =>{
                console.log(error.message);
                let blahs = getValue('realtorloginwrapper1');
                let blahs1 = getValue('realtorloginwrapper2');
                if(blahs != undefined && blahs1 != undefined &&
                    blahs != 'undefined' && blahs1 != 'undefined' 
                    
                ){
                    doLogin({ username: blahs, password: blahs1 })
                .then((result) => {
                    window.location.href = result;
                    // this.disableButton(false);
                    // this.submitLoading = false;
                })
                .catch((error) => {
                    try{
                    setValue('realtorloginwrapper1', undefined);
                    setValue('realtorloginwrapper2', undefined);
                    }catch(error){
                        console.log('set value error');
                    }
                    // this.disableButton(false);
                    // this.submitLoading = false;
                    // this.errorCheck = true;
                    // this.errorMessage = 'Your email or password is incorrect, try again or click Forgot Password.'
                });
                }
            });
        }catch(error){
            console.log(error.message);
        }
    }

    handleUserNameChange(event) {
        this.userName = event.target.value;
        this.email = event.target.value;
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

    handlePasswordChange(event) {
        this.password = event.target.value;
    }

    handleEnter(e) {
        if (e.keyCode === 13) {
            if (this.validEmail) {
                this.disableButton(true);
                this.submitLoading = true;
                this.handleLogin();
                return;
            }
            this.handleEmail();
        }
    }

    handleForgotPassword(){
        this.forgotPassword = true;
        this.loginForm = false;
    }

    backToLogin(){
        this.forgotPassword = false;
        this.errorCheck = false;
        this.loginForm = true;
    }

    handleLogin() {
        try { this.password = this.template.querySelector('input[data-id=inputPassword').value; } catch (error) { }
        if (this.userName && this.password) {
            doLogin({ username: this.userName, password: this.password })
                .then((result) => {
                    try{
                        setValue('realtorloginwrapper1', this.userName);
                        setValue('realtorloginwrapper2', this.password);
                        }catch(error){
                            console.log('set value error');
                        }
                    window.location.href = result;
                    // this.disableButton(false);
                    // this.submitLoading = false;
                })
                .catch((error) => {
                    this.disableButton(false);
                    this.submitLoading = false;
                    this.errorCheck = true;
                    this.errorMessage = 'Your email or password is incorrect, try again or click Forgot Password.'
                });
        } else {
            this.disableButton(false);
            this.submitLoading = false;
            this.errorCheck = true;
            this.errorMessage = 'Your email or password is incorrect, try again or click Forgot Password.'
        }
    }

    goBack() {
        this.validEmail = false;
    }

    handleEmail() {
        this.disableButton(true);
        this.submitLoading = true;
        try {
            this.userName = this.template.querySelector('input[data-id=inputUsername').value;
            this.password = this.template.querySelector('input[data-id=inputPassword').value;
        } catch (error) {}
        let emailCheck = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.userName);
        if (emailCheck == null || emailCheck == undefined || emailCheck == false) {
            this.errorMessage = 'Please enter a valid email address';
            this.errorCheck = true;
            this.disableButton(false);
            this.submitLoading = false;
            return;
        } else {
            this.errorCheck = false;
            if (this.userName) {
                isEmailExist({ username: this.userName })
                    .then((result) => {
                        if (result != null && result != undefined && result == true) {
                            this.validEmail = true;
                            this.handleLogin();
                        } else {
                            this.disableButton(false);
                            this.submitLoading = false;
                            this.errorCheck = true;
                            this.errorMessage = 'Your email or password is incorrect, try again or click Forgot Password.';
                        }
                    })
                    .catch((error) => {
                        this.disableButton(false);
                        this.submitLoading = false;
                        this.errorCheck = 'Your email or password is incorrect, try again or click Forgot Password.';
                    });
            }
        }
    }
}