import { LightningElement ,track } from 'lwc';

export default class EmployeeDetails extends LightningElement {
 
   @track name;
    @track salary;
    @track age;
    @track gender;

      handleNameChange (event)
      {
       
        //  neeed to get all the values and store in the  declare variable
        
        if ( event.target.name  ==  'name')
        {   
            this.name = event.target.value;
        }
        if( event.target.name  ==  'salary')
        {
            this.salary = event.target.value;
        }
        if ( event.target.name  ==  'age')
        {
           this.age = event.target.value;
        }
        if ( event.target.name  ==  'gender')
        {
             this.gender = event.target.value;
        }
        

      }

}