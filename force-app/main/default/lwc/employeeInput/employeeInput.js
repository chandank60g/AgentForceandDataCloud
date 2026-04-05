import { LightningElement, api } from 'lwc';

export default class EmployeeInput extends LightningElement {
    name = '';
    salary = '';
    age = '';
    gender = '';

    handleChange(event) {
        const { name, value } = event.target;
        this[name] = value;
        this.dispatchEvent(new CustomEvent('inputchange', { detail: { name, value } }));
    }
}