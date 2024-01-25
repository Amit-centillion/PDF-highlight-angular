import { AfterViewInit, Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports:[FormsModule,ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  userForm: FormGroup | any;

  @Output() UserValid = new EventEmitter<boolean>();
  constructor(private UserService : UserService){}
  
  ngOnInit(): void {
    this.initForm();
  }
  initForm(){
    this.userForm = new FormGroup({
      userId : new FormControl(),
    })
  }
  onClickSubmit(){
    let data :any = this.userForm.value;
    this.UserService.userValidation(data.userId).subscribe((response:any)=>{ 
      if(response.status === "Success"){
        this.UserValid.emit(true) 
      }     
    },
    (error) => {
    console.log('error', error)
    alert('Invalid user Id try again!')
    })
  }
}
