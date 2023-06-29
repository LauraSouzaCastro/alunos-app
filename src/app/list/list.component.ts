import { Component, OnInit, inject } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../aluno.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  studentList: Student[] = [];
  studentService: StudentService = inject(StudentService);

  constructor() { }

  ngOnInit() {
    this.studentService.getAllStudents().then((studentList: Student[]) => {
      this.studentList = studentList;
    });

    this.studentService.getChanges().subscribe(item => {
      this.studentList = item;
    });
  }
  
}
