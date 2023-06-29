import { Component, OnInit, inject } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  studentList: Student[] = [];
  editModeStudentId: number | null = null;

  applyForm = new FormGroup({
    Nome: new FormControl(''),
    Email: new FormControl(''),
    DataNascimento: new FormControl(''),
    Sexo: new FormControl('')
  });

  constructor(private studentService: StudentService,private datePipe: DatePipe, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.studentService.getAllStudents().then((studentList: Student[]) => {
      this.studentList = studentList;
    });

    this.studentService.getChanges().subscribe(item => {
      this.studentList = item;
    });
  }

  isEditMode(PessoaId: number): boolean {
    return this.editModeStudentId === PessoaId;
  }

  async editStudent(PessoaId: number) {
    if (PessoaId) {
      this.editModeStudentId = this.editModeStudentId === PessoaId ? 0 : PessoaId;
      const student = await this.studentService.getStudentById(PessoaId)
      this.applyForm.patchValue({
        Nome: student[0].Nome,
        Email: student[0].Email,
        DataNascimento: student[0].DataNascimento.split('-').reverse().join('-'),
        Sexo: student[0].Sexo
      });
      this.cdr.detectChanges();
    }
  }

  onKeyPressed(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      try {
        const studentList = this.studentList.map(student => {
          if (student.PessoaId === this.editModeStudentId) {
  
            const dataNascimento = new Date(this.applyForm.value.DataNascimento ?? '');
            dataNascimento.setMinutes(dataNascimento.getMinutes() + dataNascimento.getTimezoneOffset());
            const dataFormatada = this.datePipe.transform(dataNascimento, 'dd-MM-yyyy');
  
            return {
              Nome: this.applyForm.value.Nome ?? '',
              Email: this.applyForm.value.Email ?? '',
              DataNascimento: dataFormatada ?? '',
              Sexo: this.applyForm.value.Sexo ?? '',
              PessoaId: student.PessoaId
            }
          } else {
            return student;
          }
        });
        this.studentService.setStudent(studentList);
      } catch (error) {
        console.log(error);
      }
      this.editModeStudentId = 0;
      this.cdr.detectChanges();
    }
  }

  deleteStudent(PessoaId: number) {
    this.studentService.deleteStudent(PessoaId);
  }

}
