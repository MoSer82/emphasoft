import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { AccountService, User } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public user: User;
  public usersList: User[];
  public filteredData: User[];
  public pageIndex: number;
  public pageSize: number;
  public count: number;
  sortData: any;
  filter: string;

  public form = new FormGroup({
    searchStr: new FormControl('')
  });

  constructor(
    private service: AccountService
  ) { }

  ngOnInit() {
    this.user = this.service.user;
    this.usersList = this.service.users;
    this.pageIndex = 0;
    this.pageSize = 25;
    this.sortData = {};
    this.prepareData();
  }

  prepareData() {
    const start = this.pageIndex * this.pageSize;
    const end = (this.pageIndex + 1) * this.pageSize;
    let list: User[];
    if (this.filter) {
      list = this.usersList.filter(item => item.username.toLowerCase().includes(this.filter.toLowerCase()));
    } else {
      list = this.usersList.slice();
    }
    if (this.sortData && this.sortData.field) {
      list.sort((a, b) => {
        return this.compare(a[this.sortData.field], b[this.sortData.field], this.sortData.isASC);
      });
    }
    this.count = list.length;
    this.filteredData = list.slice(start, end);
  }

  sortTable(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortData.field = '';
      this.sortData.isASC = false;
      return;
    }
    this.sortData.field = sort.active;
    this.sortData.isASC = sort.direction === 'asc';
    this.prepareData();
  }

  compare(a: string | number, b: string | number, isASC: boolean) {
    return ((a < b) ? -1 : 1 ) * (isASC ? 1 : -1);
  }

  filterUsers() {
    const search = this.form.get('searchStr').value;
    if (search && search.length) {
      this.filter = search;
    } else {
      this.filter = '';
    }
    this.prepareData();
  }

  changePage(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.prepareData();
  }

  formatDate(date: string) {
    return (date) ? moment(date).format('DD.MM.YYYY (HH:mm)') : '';
  }

  logout() {
    this.service.logout();
  }

}
