// accountCreator.js
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createAccount from '@salesforce/apex/AccountCreatorController.createAccount';

export default class AccountCreator extends LightningElement {
    accountData = {
        Name: '',
        Phone: '',
        Industry: '',
        BillingStreet: '',
        BillingCity: '',
        BillingState: '',
        BillingPostalCode: '',
        BillingCountry: ''
    };

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.accountData = { ...this.accountData, [field]: event.target.value };
    }

    handleCreateAccount() {
        if (!this.accountData.Name) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Account Name is required.',
                variant: 'error'
            }));
            return;
        }

        createAccount({ accountData: this.accountData })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Account created successfully!',
                    variant: 'success'
                }));
                this.resetForm();
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                }));
            });
    }

    resetForm() {
        this.accountData = {
            Name: '',
            Phone: '',
            Industry: '',
            BillingStreet: '',
            BillingCity: '',
            BillingState: '',
            BillingPostalCode: '',
            BillingCountry: ''
        };
    }
}