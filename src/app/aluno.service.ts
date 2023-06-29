import { Injectable } from '@angular/core';
import { Student } from './student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  url = 'https://6467a872e99f0ba0a814b5ff.mockapi.io/api/Pessoas';

  constructor() { }

  async getAllStudents(): Promise<Student[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getStudentById(id: number): Promise<Student | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return await data.json() ?? {};
  }

}
