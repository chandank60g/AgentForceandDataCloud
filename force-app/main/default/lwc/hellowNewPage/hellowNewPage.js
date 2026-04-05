import { LightningElement } from 'lwc';



export default class HellowNewPage extends LightningElement {
    firstName = '';
    lastName = '';
    fullName = '';

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
        this.updateFullName();
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
        this.updateFullName();
    }

    updateFullName() {
        this.fullName = `${this.firstName} ${this.lastName}`.trim();
    }
}