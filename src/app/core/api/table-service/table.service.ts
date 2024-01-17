import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { employees } from '../../utils/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private tableData: employees[] = [] ;
  private currentIndex: number = -1;
  API: any = environment.employesApi;
  constructor(private http: HttpClient) { }

  getEmployes() {
    return this.http.get(this.API + '/employees');
  }

  getColumns() {
    return this.http.get(this.API + '/cols');
  }

  get currentTableData() {
    return this.tableData[this.currentIndex];
  }

  saveState(data: employees): void {
    this.currentIndex++;
    this.tableData.splice(this.currentIndex); // Remove redo history
    this.tableData.push(data);
  }

  undo(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  redo(): void {
    if (this.currentIndex < this.tableData.length - 1) {
      this.currentIndex++;
    }
  }
}
