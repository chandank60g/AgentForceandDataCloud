import { LightningElement, track } from 'lwc';
import submitClaimApex from '@salesforce/apex/FNOLClaimController.submitClaim';

export default class FnolClaimForm extends LightningElement {
    @track policyNumber = '';
    @track incidentDate = '';
    @track location = '';
    @track fileId = '';
    @track statusMessage = '';
    recordId = null; // Placeholder if needed for file upload

    handleChange(event) {
        const field = event.target.label.replace(/\s+/g, '').toLowerCase();
        if(event.target.label == 'Incident Date')
        {
            this.incidentDate = event.target.value;
        }
        if( event.target.label == 'Policy Number')
        {
            this.policyNumber=event.target.value;
        }
        
        
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        this.fileId = uploadedFiles[0].documentId;
    }

    submitClaim() {
        submitClaimApex({
            policyNumber: this.policyNumber,
            incidentDate: this.incidentDate,
            location: this.location,
            fileId: this.fileId
        })
        .then(result => {
            this.statusMessage = 'Claim submitted successfully!';
        })
        .catch(error => {
            this.statusMessage = 'Error: ' + error.body.message;
        });
    }
}