import { LightningElement, track } from 'lwc';

import postClass from '@salesforce/apex/realtorPortal.postClass'

export default class RealtorPortalClass extends LightningElement {
    @track page1 = true;
    @track page2 = false;


    @track originators = [
        {'name': 'Brett Seal', 'id': '0055e000006LKsgAAG', 'dates': ['2025-01-08', '2025-01-15', '2025-01-22', '2025-01-29']},
        {'name': 'Tim Torres', 'id': '0055e000007CjjUAAS', 'dates': ['2025-01-08', '2025-01-15', '2025-01-22', '2025-01-29']},
        {'name': 'Berkeley Peterson', 'id': '0055e000007Cje1AAC', 'dates': ['2024-12-04', '2024-12-11', '2024-12-18']},
        {'name': 'Paola Rodriguez', 'id': '0055e000007CjjNAAS', 'dates': []},
        {'name': 'Joana Rosario', 'id': '0055e000007DxQ8AAK', 'dates': ['2025-01-03']},
        {'name': 'Renuka Chaitoo-Flanders', 'id': '005Pd000000NUJxIAO', 'dates': ['2025-01-08', '2025-01-15', '2025-01-22', '2025-01-29']},
        

    ]

    classClick(e){
        try{
        console.log(e.target.value);
        let sessionId = e.target.value;
        this.originators = this.loHold;
        this.courses['Building Partnerships'].forEach(ele =>{
            ele.sessions.forEach(element =>{
                if(element.Id == sessionId){
                    try{
                    console.log(element.Start_Date__c);
                    this.selectedSession = element.Start_Date__c.substring(0,10);
                    this.removeLos();
                    this.template.querySelector('button[Label="Register"]').disabled = false;
                
                    }catch(error){
                        console.log(error.message);
                    }
                }
            })
        })
    }catch(error){
        console.log(error.message);
    }

    }

    removeLos(){
  
console.log('remove lo');
try{
    console.log(this.originators.length)
            for (let i = this.originators.length - 1; i >= 0; i--) {
                console.log(this.originators[i]);
                let present = false;
                this.originators[i].dates.forEach(ele =>{
                    console.log('dates');
                    console.log(ele);
                    console.log(this.selectedSession);
                    if(ele == this.selectedSession){
                        present = true;
                    }
                    
                })
                if(present == false){
                    this.originators.splice(i, 1);
                }
            }
        }catch(error){
            console.log(error.message);
        }
    }

    @track loHold = this.originators;

    loClick(e){
        try{
        console.log('lo click');
        

        this.selectedLO = e.target.value;
        this.template.querySelector('button[Label="Register"]').disabled = false;
        }catch(error){
            console.log(error.message);
        }

    }
    @track page3;

    async registerClick(e){
        if(this.page1 == true){
            this.page1 = false;
            this.page2 = true;
        }else{
            
        this.template.querySelector('button[Label="Register"]').disabled = true;
            await postClass({id: this.selectedLO, dateString: this.selectedSession}).then( result =>{
                this.page2 = false;
                this.page3 = true;
            }).catch(error =>{
                console.log(error.body.message);
            })
            
        }
    }

    @track selectedSession;

    @track description = '<p ><strong>Will there be food on campus?</strong></p><p class="ql-indent-1">Yes, lunch will be provided. Additionally, we have a full cafeteria and other restaurant options that rotate daily. </p><p><strong >Will transportation be provided to and from the airport?</strong></p><p class="ql-indent-1">No, you will be responsible for transportation to and from the airport.</p><p><strong >Will there be transportation from the hotel to UWM?</strong></p><p class="ql-indent-1">Yes! UWM provides shuttles to and from our campus, starting between 8:05AM and 8:15AM.</p><p ><strong>How early should I arrive to UWM?</strong></p><p class="ql-indent-1">Doors open for check-in at 8:30AM. All classes and Mat’s Weekly Huddle start promptly at 9AM.</p><p ><strong>Will I have any time in the day to make follow up calls/emails to clients?</strong></p><p class="ql-indent-1">Yes, there will be breaks scheduled throughout the day.</p><p ><strong>Will I need my EASE log in credentials?</strong></p><p class="ql-indent-1">Yes, please bring your EASE log in credentials.</p><p ><strong>What should I wear?</strong></p><p class="ql-indent-1">Comfortable shoes, if possible. We have a large campus with multiple buildings, so walking is required.</p></span>';

    @track courses = {"Building Partnerships": [
        ,
                            {
                                "course": {
                                    "Id": "a3N7V000002dn0HUAQ",
                                    "Name": "1-Day Real Estate Agent & Builder Training at UWM",
                                    "FAQ__c": "<p><strong>Will there be food on campus?<\/strong><\/p><p class=\"ql-indent-1\">Yes, lunch will be provided. Additionally, we have a full cafeteria and other restaurant options that rotate daily.<\/p><p><strong>Will transportation be provided to and from the airport?<\/strong><\/p><p class=\"ql-indent-1\">No, you will be responsible for transportation to and from the airport.<\/p><p><strong>Will there be transportation from the hotel to UWM?<\/strong><\/p><p class=\"ql-indent-1\">Yes! UWM provides shuttles to and from our campus, starting between 8:05AM and 8:15AM.<\/p><p><strong>How early should I arrive to UWM?<\/strong><\/p><p class=\"ql-indent-1\">Doors open for check-in at 8:05AM. All classes and Mat\u2019s Weekly Huddle start promptly at 9AM.<\/p><p><strong>Will I have any time in the day to make follow up calls/emails to clients?<\/strong><\/p><p class=\"ql-indent-1\">Yes, there will be breaks scheduled throughout the day.<\/p><p><strong>Will I need my EASE log in credentials?<\/strong><\/p><p class=\"ql-indent-1\">Yes, please bring your EASE log in credentials.<\/p><p><strong>What should I wear?<\/strong><\/p><p class=\"ql-indent-1\">Comfortable shoes, if possible. We have a large campus with multiple buildings, so walking is required.<\/p>",
                                    "Agenda__c": "<p><br><\/p><table class=\"ql-table-blob\" border=\"0\" style=\"width: 403pt;\" width=\"538\"><tbody><tr style=\"height: 72.0pt;\" height=\"96\"><td colspan=\"1\" rowspan=\"1\" class=\"xl63\" style=\"height: 72.0pt; width: 403pt;\" width=\"538\" height=\"96\">Designed\n  for UWM LOs and brokers, this is a step-by-step course to building lasting\n  relationships with real estate agents and builders. We\u2019ll help you better\n  understand how to successfully connect with agents in your market and how you\n  are uniquely positioned to provide invaluable partnership support to them as\n  an independent mortgage professional.<\/td><\/tr><\/tbody><\/table><p>Brokers and loan officers are welcome to invite up to 3 agents/builders per session. You and your partner can expect an immersive day focused on introducing them to the benefits of wholesale partnership. UWM Partners are asked to invite and register their prospective or current real estate agent partners directly. <\/p><p>Topics include:<\/p><p>\u2022\tHow you are uniquely positioned to provide invaluable partnership support as an independent  mortgage professional<\/p><p>\u2022\tExclusive tools and resources available to you that can help you both grow your businesses<\/p><p>\u2022\tOffering elite service to buyers<\/p><p>\u2022\tGaining referrals <\/p><p>\u2022\tReal Estate and Builders: Partners LOPP<\/p><p>\u2022\tPlus, much more!<\/p><p><br><\/p><p>Class runs Wednesday: 9:00-5:00pm EST (Mixer with UWM Senior Leadership from 5:00-6:00pm)<\/p>",
                                    "Description__c": "Designed for UWM LOs and brokers, this is a step-by-step course to building lasting relationships with real estate agents and builders. We\u2019ll help you better understand how to successfully connect with agents in your market and how you are uniquely positioned to provide invaluable partnership support to them as an independent mortgage professional.",
                                    "Course_Type__c": "On-Site"
                                },
                                "courseDetails": [
                                    {
                                        "Id": "a4F7V000000N3u5UAC",
                                        "Role__c": "Loan Officer",
                                        "Level__c": 1,
                                        "Path__c": "Building Partnerships",
                                        "Active__c": true,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ"
                                        }
                                    },
                                    {
                                        "Id": "a4F7V000000N3uUUAS",
                                        "Role__c": "Broker Owner",
                                        "Level__c": 1,
                                        "Path__c": "Building Partnerships",
                                        "Active__c": true,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ"
                                        }
                                    }
                                ],
                                "courseImage": "https://uwm.my.salesforce.com/sfc/servlet.shepherd/version/download/068Vp000009sp5HIAQ",
                                "sessions": [
                                    {
                                        "Id": "a3UVp000000EwlhMAC",
                                        "Start_Date__c": "2025-01-29T14:00:00.000Z",
                                        "End_Date__c": "2025-01-29T23:00:00.000Z",
                                        "Seats_Remaining__c": -22,
                                        "Session_Capacity__c": 145,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 22,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000FZ2HMAW",
                                        "Start_Date__c": "2025-01-22T14:00:00.000Z",
                                        "End_Date__c": "2025-01-22T23:00:00.000Z",
                                        "Seats_Remaining__c": -31,
                                        "Session_Capacity__c": 142,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 32,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000HwXRMA0",
                                        "Start_Date__c": "2025-02-05T14:00:00.000Z",
                                        "End_Date__c": "2025-02-05T23:00:00.000Z",
                                        "Seats_Remaining__c": 61,
                                        "Session_Capacity__c": 265,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 0,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000HwZ3MAK",
                                        "Start_Date__c": "2025-02-12T14:00:00.000Z",
                                        "End_Date__c": "2025-02-12T23:00:00.000Z",
                                        "Seats_Remaining__c": 100,
                                        "Session_Capacity__c": 147,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 0,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000HwafMAC",
                                        "Start_Date__c": "2025-02-19T14:00:00.000Z",
                                        "End_Date__c": "2025-02-19T23:00:00.000Z",
                                        "Seats_Remaining__c": 228,
                                        "Session_Capacity__c": 265,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 0,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000HwcHMAS",
                                        "Start_Date__c": "2025-02-26T14:00:00.000Z",
                                        "End_Date__c": "2025-02-26T23:00:00.000Z",
                                        "Seats_Remaining__c": 243,
                                        "Session_Capacity__c": 265,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 0,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000HwdtMAC",
                                        "Start_Date__c": "2025-03-05T14:00:00.000Z",
                                        "End_Date__c": "2025-03-05T23:00:00.000Z",
                                        "Seats_Remaining__c": 255,
                                        "Session_Capacity__c": 265,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 0,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000HwfVMAS",
                                        "Start_Date__c": "2025-03-12T13:00:00.000Z",
                                        "End_Date__c": "2025-03-12T22:00:00.000Z",
                                        "Seats_Remaining__c": 258,
                                        "Session_Capacity__c": 265,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 0,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000HwijMAC",
                                        "Start_Date__c": "2025-03-19T13:00:00.000Z",
                                        "End_Date__c": "2025-03-19T22:00:00.000Z",
                                        "Seats_Remaining__c": 245,
                                        "Session_Capacity__c": 265,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 0,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    },
                                    {
                                        "Id": "a3UVp000000HwkLMAS",
                                        "Start_Date__c": "2025-03-26T13:00:00.000Z",
                                        "End_Date__c": "2025-03-26T22:00:00.000Z",
                                        "Seats_Remaining__c": 258,
                                        "Session_Capacity__c": 265,
                                        "Course__c": "a3N7V000002dn0HUAQ",
                                        "Waitlisted_Attendees__c": 0,
                                        "Course__r": {
                                            "Id": "a3N7V000002dn0HUAQ",
                                            "Course_Type__c": "On-Site"
                                        }
                                    }
                                ]
                            }
    ]
    }
}