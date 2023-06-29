import { Component, inject } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../aluno.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  studentList: Student[] = [];
  studentService: StudentService = inject(StudentService);

  constructor() {
    this.studentService.getAllStudents().then((studentList: Student[]) => {
      this.studentList = studentList;
    });
  }
  
}
