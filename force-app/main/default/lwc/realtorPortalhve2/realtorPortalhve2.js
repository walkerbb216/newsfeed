import { LightningElement, track } from 'lwc';
import fetchHVE from '@salesforce/apex/realtorPortal.fetchHVENext2';
import getHVELinkNext from '@salesforce/apex/realtorPortal.getHVELinkNext';

import fetchHVEPDF from '@salesforce/apex/realtorPortal.fetchHVEPDF';
import postLog from '@salesforce/apex/realtorPortal.postLog';

import Id from "@salesforce/user/Id";



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
    @track addressString;
    
    userId = Id;

    connectedCallback(){
        console.log(this.userId);
        if(this.userId == '005Pd000001KuK1IAK'){
            this.show = true;
        }
    }
    handleChange(e) {
        console.log('handlechange');
        this.address.Street__c = e.target.street;
        this.address.City__c = e.target.city;
        this.address.Country__c = e.target.country;
        this.address.State__c = e.target.province;
        this.address.ZipCode__c = e.target.postalCode;
    } 
    @track interactiveString;
    @track searchError;
    @track searchText = 'Search';

    handleSelection(e){
        console.log(e.detail);
        this.addressString = e.detail;
    }

    async handleClick(e) {
        if(this.searchDisabled){
            return;
        }
        if (this.searchText == 'Search') {
            
            this.searchDisabled = true;
            this.disableButtons = true;
            let addressString = this.addressString;
            
            console.log(addressString);
            //return;
            try { console.log(e.target.disabled) } catch (error) {
                console.log(error.message);
            }
            await fetchHVE({ address: addressString }).then(result => {
                this.searchDisabled = undefined;
                console.log(result);
                this.interactiveString = undefined;
                try {
                    this.disableButtons = undefined;
                    let addressMap = JSON.parse(result);
                    if (result.indexOf('$0 to $0') != -1) {
                        this.searchError = 'No residential home value exists for this address "' + addressString + '"';
                        this.postLogEntry('fetchHVE',  addressString + ' - ' + result);
                        return;
                    }
                    this.searchError = undefined;
                   
                    this.searchText = 'New Search';
                    try{
                        this.parseResponse(addressMap.data.houseMarketValue);
                    }catch(error){
                        console.log(error.message);
                    }
                    this.postLogEntry('fetchHVE',  addressString + ' - ' + result);
                    this.valueData = 'blah';
                } catch (error) {
                    this.searchDisabled = undefined;
                    this.disableButtons = undefined;
                    console.log(error.message);
                    try{
                        
                    this.postLogEntry('fetchHVEFail',  addressString + ' - ' + JSON.stringify(error));
                    }catch(errorr){

                    }
                }
                // 
            }).catch(error => {
                this.searchDisabled = undefined;
                
                this.disableButtons = undefined;
                this.postLogEntry('fetchHVEFail',  addressString + ' - ' + JSON.stringify(error.body));
            })
        } else {
            console.log('resett');
            this.valueData = undefined;
            this.address = {};
            this.searchText = 'Search';
            this.resetVar();
        }
    }
    parseResponse(result){
        if(result){
            //result = result.substr(result.indexOf('<p class="details">') + 19, result.length);
            this.propertyDetails = result.propertyType + ' | ' +  result.bedrooms + ' Bedrooms | ' + result.bathrooms + ' Bathrooms | ' + result.grossLivingAreaSquareFeet;
            this.propertyRange = 'Range: $' + result.minValue + ' to $' + result.maxValue;
            this.propertyEstimatedCost = result.value;
            this.propertyAnnualTax = result.propertyTaxes;
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

    @track interactiveDisabled;
    async openInteractive() {
        
        this.interactiveDisabled = true;
        await getHVELinkNext({ address: this.addressString }).then(resultser =>{
            console.log('link');
            console.log(resultser)
            let blah = JSON.parse(resultser);
            console.log('blah');
            this.interactiveString = blah.data.homeValueInteractiveReportLink;
            this.interactiveDisabled = false;
            window.open(this.interactiveString, "_blank");
        })
        
    }

    postLogEntry(type, logString){
        postLog({type: type, component:  this.template.host.localName, logString: logString});
    }
}