import { LightningElement, wire } from 'lwc';
import fetchContacts from '@salesforce/apex/ContactController.fetchContacts';
import updateContacts from '@salesforce/apex/ContactController.updateContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactList extends LightningElement {
    contacts = [];
    error;
    draftValues = [];

    // Define columns for lightning-datatable
    columns = [
        { label: 'First Name', fieldName: 'FirstName', type: 'text' },
        { label: 'Last Name', fieldName: 'LastName', type: 'text' },
        { label: 'Email', fieldName: 'Email', type: 'email', editable: true },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Id', fieldName: 'Id', type: 'text' }, // Added Id column
    ];

    // Fetch contacts from Apex
    @wire(fetchContacts)
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
            this.contacts = [];
        }
    }

    // Handle input changes
    handleInputChange(event) {
        const contactId = event.target.dataset.id;
        const field = event.target.dataset.field;
        const newValue = event.target.value;

        const index = this.draftValues.findIndex(item => item.Id === contactId);

        if (index === -1) {
            this.draftValues = [...this.draftValues, { Id: contactId, [field]: newValue }];
        } else {
            this.draftValues[index] = { ...this.draftValues[index], [field]: newValue };
        }
    }

    // Save updated contacts
    saveContact(event) {
        const contactId = event.target.dataset.id;
        const contactIndex = this.contacts.findIndex(contact => contact.Id === contactId);

        if (contactIndex !== -1) {
            updateContacts({ contacts: this.draftValues })
                .then(() => {
                    this.showToast('Success', 'Records updated successfully', 'success');
                    this.draftValues = [];
                })
                .catch(error => {
                    this.showToast('Error', 'Error updating records', 'error');
                    this.error = error;
                });
        }
    }

    // Show * messages
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}