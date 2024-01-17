import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonTableComponent } from './components/common-table/common-table.component';
import { UiModule } from '../ui/ui.module';
import { FormsModule } from '@angular/forms';
import {ToolbarModule} from 'primeng/toolbar';
import { DialogModule } from "primeng/dialog"; 
import { MessagesModule } from 'primeng/messages';


@NgModule({
  declarations: [
    CommonTableComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    ToolbarModule,
    DialogModule,
    MessagesModule
  ],
  exports: [CommonTableComponent]
})
export class SharedModule { }
