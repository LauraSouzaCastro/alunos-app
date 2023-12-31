import { Injectable } from '@angular/core';
import { Student } from './student';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  url = 'https://6467a872e99f0ba0a814b5ff.mockapi.io/api/Pessoas';

  private storage: Storage;
  private storageSubject = new Subject<any>();

  constructor() {
    this.storage = window.localStorage;
    if (this.storage && !JSON.parse(this.storage.getItem("Students") ?? '[]').length) {
      this.getAllStudentsAPI().then((studentList: Student[]) => {
        this.storage.setItem("Students", JSON.stringify(studentList));
      })
    }
  }

  async getAllStudentsAPI(): Promise<Student[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getAllStudents(): Promise<Student[]> {
    if (this.storage && this.storage.getItem("Students")) {
      return JSON.parse(this.storage.getItem("Students") ?? '[]');
    }
    return this.getAllStudentsAPI().then((studentList: Student[]) => {
      return studentList;
    })
  }

  setStudent(students: Student[]): void {
    if (this.storage) {
      this.storage.setItem("Students", JSON.stringify(students));
      this.storageSubject.next(students);
    }
  }

  getChanges(): Observable<any> {
    return this.storageSubject.asObservable();
  }

  deleteStudent(PessoaId: number): void {
    this.getAllStudents().then((list: Student[]) => {
      this.setStudent((list.filter(student => Number(student.PessoaId) !== Number(PessoaId))))
    });
  }

  async getStudentById(PessoaId: number): Promise<Student[]> {
    const list = await this.getAllStudents();
    return list.filter(student => Number(student.PessoaId) === Number(PessoaId));
  }

}
