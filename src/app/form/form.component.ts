import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../student.service';
import { Student } from '../student';
import { DatePipe } from '@angular/common';

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

  constructor(private datePipe: DatePipe) { }

  async createStudent() {
    await this.studentService.getAllStudents().then((studentList: Student[]) => {

      var lastId: number = 0

      if(studentList.length && Number(studentList[studentList.length - 1].PessoaId)) lastId = Number(studentList[studentList.length - 1].PessoaId);
      try {
        if(!this.applyForm.value.Nome || !this.applyForm.value.Email || !this.applyForm.value.DataNascimento || !this.applyForm.value.Sexo) throw new Error('Todos os dados são obrigatórios');
        
        const dataNascimento = new Date(this.applyForm.value.DataNascimento ?? '');
        dataNascimento.setMinutes(dataNascimento.getMinutes() + dataNascimento.getTimezoneOffset());
        const dataFormatada = this.datePipe.transform(dataNascimento, 'dd-MM-yyyy');
        
        studentList.push({
          Nome: this.applyForm.value.Nome ?? '',
          Email: this.applyForm.value.Email ?? '',
          DataNascimento: dataFormatada ?? '',
          Sexo: this.applyForm.value.Sexo ?? '',
          PessoaId: lastId + 1
        });
      } catch (error) {
        console.log(error)
      }
      this.studentService.setStudent(studentList);
      this.applyForm.patchValue({
        Nome:'',
        Email: '',
        DataNascimento: '',
        Sexo: ''
      });
    });
  }

}
