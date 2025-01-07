import { LightningElement, track } from 'lwc';
import fetchHVE from '@salesforce/apex/realtorPortal.fetchHVE';
import fetchHVEPDF from '@salesforce/apex/realtorPortal.fetchHVEPDF';
import postLog from '@salesforce/apex/realtorPortal.postLog';

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  
  

export default class RealtorPortalhve extends LightningElement {
    @track address = {};
    @track valueData;
    @track searchDisabled;
    @track downloadString;
    @track disableButtons;
    handleChange(e) {
        this.address.Street__c = e.target.street;
        this.address.City__c = e.target.city;
        this.address.Country__c = e.target.country;
        this.address.State__c = e.target.province;
        this.address.ZipCode__c = e.target.postalCode;
    }
    @track interactiveString;
    @track searchError;
    @track searchText = 'Search';

    async handleClick(e) {
        if(this.searchDisabled){
            return;
        }
        if (this.searchText == 'Search') {
            this.searchDisabled = true;
            this.disableButtons = true;
            let addressString = this.address.Street__c + ', ' + this.address.City__c + ', ' + this.address.State__c + ' ' + this.address.ZipCode__c;
            
            try { console.log(e.target.disabled) } catch (error) {
                console.log(error.message);
            }
            await fetchHVE({ address: addressString }).then(result => {
                this.searchDisabled = undefined;
                try {
                    this.disableButtons = undefined;
                    if (result.indexOf('$0 to $0') != -1) {
                        this.searchError = 'No residential home value exists for this address "' + addressString + '"';
                        this.postLogEntry('fetchHVE',  addressString + ' - ' + result);
                        return;
                    }
                    this.valueData = result;
                    console.log(this.valueData);
                    try{
                        //
                        let tee = this.valueData.substr(0, this.valueData.indexOf('<span class="description">'));
                        let hee = this.valueData.substr(this.valueData.indexOf('</span>') + 7, this.valueData.length);
                        this.valueData = tee + hee;
            
                    }catch(error){
                        console.log(error.message);
                    }
                    this.searchError = undefined;
                    let valer = this.valueData.substr(this.valueData.indexOf('/manage-your-pipeline/pipeline-tools-in/PDFDisplay/'), this.valueData.length - this.valueData.indexOf('/manage-your-pipeline/pipeline-tools-in/PDFDisplay/'));
                    valer = valer.substr(0, valer.indexOf(' class=') - 1);
                    this.downloadString = valer;
                    let interactive = this.valueData.substr(this.valueData.indexOf('https://pexp.'), this.valueData.length - this.valueData.indexOf('https://pexp.'));
                    interactive = interactive.substr(0, interactive.indexOf(' class=') - 1);
                    this.interactiveString = interactive;
                    this.valueData = this.valueData.substr(0, this.valueData.indexOf('NEW SEARCH'));
                    this.searchText = 'New Search';
                    try{
                        this.parseResponse(result);
                    }catch(error){
                        console.log(error.message);
                    }
                    this.postLogEntry('fetchHVE',  addressString + ' - ' + result);
                } catch (error) {
                    this.searchDisabled = undefined;
                    this.disableButtons = undefined;
                    console.log(error.message);
                }
                // 
            }).catch(error => {
                this.searchDisabled = undefined;
                this.valueData = error.body.message;
            })
        } else {
            this.valueData = undefined;
            this.address = {};
            this.searchText = 'Search';
            this.resetVar();
        }
    }
    parseResponse(result){
        if(result){
            result = result.substr(result.indexOf('<p class="details">') + 19, result.length);
            this.propertyDetails = result.substr(0, result.indexOf('</p>'));
            result = result.substr(result.indexOf('<p class="range">') + 17, result.length);
            this.propertyRange = result.substr(0, result.indexOf('</p>'));
            result = result.substr(result.indexOf('<p class="estimated-cost bold">&#42; ') + 37, result.length);
            this.propertyEstimatedCost = result.substr(0, result.indexOf('</p>'));
            result = result.substr(result.indexOf('<p class="tax-amount">') + 22, result.length);
            this.propertyAnnualTax = result.substr(0, result.indexOf('</p>'));  
            this.parsedProperty = true; 
        }
    }

    @track propertyAnnualTax;
    @track propertyDetails;
    @track propertyEstimatedCost;
    @track propertyRange;
    @track parsedProperty;

    resetVar(){
        this.propertyDetails = undefined;
        this.propertyRange = undefined;
        this.propertyEstimatedCost = undefined;
        this.propertyAnnualTax = undefined; 
        this.parsedProperty = undefined; 
    }

    async download() {
        this.disableButtons = true;
        await fetchHVEPDF({ url: this.downloadString }).then(result => {
            console.log(result);
            let downloadLink = document.createElement("a");
            downloadLink.href = "data:application/pdf;base64," + result;
            const contentType = 'application/pdf';
            const b64Data = result;
            
            const blob = b64toBlob(b64Data, contentType);
            const blobUrl = URL.createObjectURL(blob);
            //window.open(blobUrl);
            window.location.href = blobUrl;
            // document.body.appendChild(img);
            // let valrr = this.downloadString.indexOf('PDFDisplay/') + 11;
            // downloadLink.download = this.downloadString.substr(valrr, this.downloadString.length - valrr);
            // downloadLink.click();
            this.disableButtons = undefined;
        }).catch(error => {
            console.log(error.message);

            this.disableButtons = undefined;
        })
    }

    openInteractive() {
        window.open(this.interactiveString, "_blank");
    }

    postLogEntry(type, logString){
        postLog({type: type, component:  this.template.host.localName, logString: logString});
    }
}