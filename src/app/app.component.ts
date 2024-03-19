import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'AnguCrud';

  displayedColumns: string[] = ['productName', 'category', 'freshness', 'date', 'price', 'comment', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog, private api: ApiService){
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent,{
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val==='Save'){
        this.getAllProducts();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllProducts(){
    this.api.getProduct().
    subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Error while fetching data");
      }
    })
  }

  editProduct(row:any){
    const dialogRef = this.dialog.open(DialogComponent,{
      width: '30%',
      data: row
    }).afterClosed().subscribe(val=>{
      if(val==='Update'){
        this.getAllProducts();
      }
    })
  }

  deleteProduct(id:number){
    this.api.deleteProduct(id).subscribe({
      next: (res)=>{
        alert('Product deleted successfully');
        this.getAllProducts();
      },
      error:(err)=>{
        alert('Error while deleting the product');
      }
    })

  }

}
