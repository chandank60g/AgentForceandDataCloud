import { LightningElement, track } from 'lwc';
import saveContact from '@salesforce/apex/ContactController.saveContact'; // Import your Apex method
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Import Toast Event

export default class EmployeeDetailsParent extends LightningElement {
    @track name;
    @track salary;
    @track age;
    @track gender;

    handleInputChange(event) {
        const { name, value } = event.detail;
        this[name] = value;
    }

    async handleSave() {
        try {
            await saveContact({ name: this.name, salary: this.salary, age: this.age, gender: this.gender });
            // Show success message
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Contact saved successfully!',
                variant: 'success'
            }));
        } catch (error) {
            // Handle error (e.g., show an error message)
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant: 'error'
            }));
        }
    }
}