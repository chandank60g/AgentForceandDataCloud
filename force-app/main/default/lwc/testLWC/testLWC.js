import { LightningElement } from 'lwc';

export default class TestLWC extends LightningElement {

    // // write code below to check if the 2 number is graeter and diplay on ui
    num1 = 10;  
    num2 = 5;
    get greaterNumber() {
        return this.num1 > this.num2 ? this.num1 : this.num2;
    }   
    
}