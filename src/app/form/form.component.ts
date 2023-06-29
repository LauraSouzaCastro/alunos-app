import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../aluno.service';
import { Student } from '../student';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  studentList: Student[] = [];
  studentService: StudentService = inject(StudentService);

  applyForm = new FormGroup({
    Nome: new FormControl(''),
    Email: new FormControl(''),
    DataNascimento: new FormControl(''),
    Sexo: new FormControl('')
  });

  async submitApplication() {
    var response = await this.studentService.getAllStudents().then((studentList: Student[]) => {

      var lastId: number = 0

      if(studentList.length) lastId = Number(studentList[studentList.length - 1].PessoaId);
      
      studentList.push({
        Nome: this.applyForm.value.Nome ?? '',
        Email: this.applyForm.value.Email ?? '',
        DataNascimento: new Date(this.applyForm.value.DataNascimento ?? ''),
        Sexo: this.applyForm.value.Sexo ?? '',
        PessoaId: lastId + 1
      });

      return this.studentService.setStudent(studentList);
    });


  }


}
