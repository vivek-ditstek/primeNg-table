import { Component, OnInit, ViewChild } from '@angular/core';
import { TableService } from 'src/app/core/api/table-service/table.service';
import { employees } from 'src/app/core/utils/table';
import { ConfirmationService, MenuItem } from 'primeng/api';
import * as saveAs from 'file-saver';
import { jsPDF as _jsPDF } from "jspdf";
import { CsvService } from 'src/app/core/csvfile/csv.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss'],
  providers: [MessageService, ConfirmationService]

})
export class CommonTableComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  employees!: employees[];
  cols!: any[];
  exportColumns!: any[];
  selectedRows: any = []
  items!: MenuItem[] | any;
  date!: Date[];
  maxDate: Date = new Date();
  selectedProducts!: employees[] | null;
  tableData!: any[][];
  originalArray !: employees[];
  calendarDate: any
  selectedParentRow: any = [];
  selectedChildrenRow: any = [];
  selectedRow: any;
  childrenCount: any;
  options: any = {
    priority: [
      { label: 'p1', value: 'p1' },
      { label: 'p2', value: 'p2' },
    ],
    claimStatus: [
      { label: 'pending', value: 'pending' },
      { label: 'paid', value: 'paid' },
    ]
  }

  product!: employees;
  productDialog: boolean = false;
  submitted: boolean = false;
  // Variables for Undo and Redo
  undoStack: any[] = [];
  redoStack: any[] = [];
  selectedRowIndex!: number;


  constructor(private tableService: TableService, private csvService: CsvService, private datePipe: DatePipe, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  calculateTotal(selectedRows: any) {
    let total = 0;
    for (const row of selectedRows) {
      total += row.rowData + row.rowData?.children;
    }
    return total;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit() {
    setTimeout(() => {
      this.getEmployes();
    }, 1000);
    this.getColumns();

  }


  getEmployes() {
    this.tableService.getEmployes().subscribe((item: any) => {
      this.employees = item;
      this.originalArray = item;
    
    });
  }

  getColumns() {
    this.tableService.getColumns().subscribe((res: any) => {
      this.cols = res;
    });
    this.exportColumns = this.cols?.map((col: any) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }



  dateFormat(value: any) {
    if (typeof value === 'object')
      return `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`;
    return value;
  }


  onEditInit(event: any) {
    // Capture the state of the row when the edit begins
   
  }
  onEditCancel(event: any) { console.log("onEditCancel", event); }
  onEditComplete(event: any) {
    // Capture the state of the row when the edit is completed
    const updatedData = { ...event.data };
    this.redoStack = []; // Clear redo stack when new edit is completed
    this.redoStack.push({ rowIndex: this.selectedRowIndex, updatedData });
  }

  onRowClick(rowData: any, rowIndex: number) {
    const originalData = { ...rowData };
    this.undoStack.push({ rowIndex, originalData });
    // Store the selected row index
    this.selectedRowIndex = rowIndex;
  }

  undo() {
    if (this.undoStack.length > 0) {
      const { rowIndex, originalData } = this.undoStack.pop();
      this.redoStack.push({ rowIndex, updatedData: { ...this.employees[rowIndex] } });

      // Revert changes
      this.employees[rowIndex] = { ...originalData };
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const { rowIndex, updatedData } = this.redoStack.pop();
      this.undoStack.push({ rowIndex, originalData: { ...this.employees[rowIndex] } });

      // Apply changes
      this.employees[rowIndex] = { ...updatedData };
    }
  }


  saveProduct() {
    this.submitted = true;
    this.undoStack.push([...this.employees]);

    if (this.product.patientName?.trim()) {
      if (this.product.claimId) {
        this.employees[this.findIndexById(this.product.claimId)] = this.product;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      } else {
        this.product.claimId = this.createId();
        this.employees.push(this.product);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      this.employees = [...this.employees];
      this.productDialog = false;
      this.product = {};
    }
  }


  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employees = this.employees.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.employees.length; i++) {
      // if (this.employees[i].claimId == id) {
      //     index = i;
      //     break;
      // }
    }

    return index;
  }


  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }


  createId(): string {
    let id: any = '';
    var chars = '0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }




  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }



  onRowEditSave(newData: employees[]) {
    // this.undoStack.push([...this.employees]);

  }




}
