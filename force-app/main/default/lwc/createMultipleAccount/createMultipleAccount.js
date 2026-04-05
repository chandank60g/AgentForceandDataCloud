import { LightningElement, track } from 'lwc';
import saveAccounts from '@salesforce/apex/AccountCreatorController.saveAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MultiAccountCreator extends LightningElement {
    @track accountData = { Name: '', Phone: '', Industry: '' };
    @track accountList = [];
    @track isEditMode = false;
    @track editIndex = null;

    // Generate unique Id for datatable rows
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substring(2);
    }

    // Getter for button label
    get buttonLabel() {
        return this.isEditMode ? 'Update Account' : 'Add Account';
    }

    // Datatable columns
    columns = [
        { label: 'id', fieldName: 'id' },
        { label: 'Name', fieldName: 'Name' },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'Industry', fieldName: 'Industry' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'Edit', name: 'edit' },
                    { label: 'Delete', name: 'delete' }
                ]
            }
        }
    ];

    handleChange(event) {
        const field = event.target.name;
        this.accountData = { ...this.accountData, [field]: event.target.value };
    }

    // Add or Update account
    handleAddAccount() {
        if (!this.accountData.Name) {
            this.showToast('Error', 'Account Name is required', 'error');
            return; 
        }

        if (this.isEditMode) {
            // Update existing account
            this.accountList[this.editIndex] = { ...this.accountData, id: this.accountList[this.editIndex].id };
            this.accountList = [...this.accountList]; // refresh table
            this.isEditMode = false;
            this.editIndex = null;
        } else {
            // Add new account with unique Id
            const newAcc = { id: this.generateId(), ...this.accountData };      
            alert( 'newAcc: ' +  JSON.stringify(newAcc) )
            this.accountList = [...this.accountList, newAcc];
             alert('this.accountList: ' +  JSON.stringify(this.accountList)) ;
           
        }

        // Reset form
        this.accountData = { Name: '', Phone: '', Industry: '' };
    }

    // Handle row actions
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        const index = this.accountList.findIndex(acc => acc.id === row.id);

        if (actionName === 'edit') {
            this.accountData = { Name: row.Name, Phone: row.Phone, Industry: row.Industry };
            this.isEditMode = true;
            this.editIndex = index;
        } else if (actionName === 'delete') {
            this.accountList.splice(index, 1);
            this.accountList = [...this.accountList];
        }
    }

    // Save all accounts to Salesforce
    handleSaveAll() {
        if (this.accountList.length === 0) {
            this.showToast('Error', 'No accounts to save', 'error');
            return;
        }

        // Remove temporary id before sending to Apex
        const accountsToSave = this.accountList.map(acc => ({
            Name: acc.Name,
            Phone: acc.Phone,
            Industry: acc.Industry
        }));

        saveAccounts({ accountsToInsert: accountsToSave })
            .then(() => {
                this.showToast('Success', 'Accounts created successfully', 'success');
                this.accountList = [];
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    // Toast utility
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}