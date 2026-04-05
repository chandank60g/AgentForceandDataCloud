import{LightningElement, api,  track, wire} from 'lwc';
import getContactsByAccountId from '@salesforce/apex/GetContactController.getContactsByAccountId';
import updateContacts from '@salesforce/apex/GetContactController.updateContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
export default class GetContactQuickAction extends LightningElement {
    
     @api recordId; // Account Id from Quick Action
    @track contacts;
    @track draftValues = [];
    isLoading = false;
    error;

    columns = [
        { label: 'First Name', fieldName: 'FirstName', editable: true },
        { label: 'Last Name', fieldName: 'LastName', editable: true },
        { label: 'Email', fieldName: 'Email', editable: true },
        { label: 'Phone', fieldName: 'Phone', editable: true }
    ];
  /*
    @wire(getContactsByAccountId, { accountId: '$recordId' })
    wiredContacts({ data, error }) {
        if (data) {
            this.contacts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }

*/

     connectedCallback() {
        this.fetchContacts();
    }

       fetchContacts() {
        alert(this.recordId);
             getContactsByAccountId({ accountId:  this.recordId})
            .then(result => {
                console.log(result);
                console.log(JSON.stringify(result));
                this.contacts = result;
            })
            .catch(error => {
                console.error('Error fetching contacts: ', error);
            });
    }

    handleSave(event) {
        this.isLoading = true;
        const updatedFields = event.detail.draftValues;

        updateContacts({ contactsToUpdate: updatedFields })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contacts updated successfully',
                        variant: 'success'
                    })
                );

                // Refresh the data
                  this.fetchContacts();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating contacts',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
            .finally(() => {
                this.draftValues = [];
                this.isLoading = false;
            });
    }
}