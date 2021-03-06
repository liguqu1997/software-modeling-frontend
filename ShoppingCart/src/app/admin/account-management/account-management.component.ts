import { Component, OnInit, ViewChild } from '@angular/core';
import { MAX_PRODUCTS_ROW_PER_PAGE } from 'src/app/shared/constants';
import { ProductService } from 'src/app/services/product.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';


@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {
  @ViewChild('content') public modal: NgbModalRef;
  listAccounts = [];
  listRoles = ['user', 'employee', 'admin']
  currentPage = 1;
  totalPage = 1;
  closeResult: string;
  user;
  userIndex;
  selectedRole;
  isShowingSpinner = false;
  filterForm: FormGroup;
  filterValue = {
    username: ''
  };
  constructor(private accountService: AccountService, private modalService: NgbModal) {}

  ngOnInit() {
    const self = this;
    self.filterForm = new FormGroup({
      username: new FormControl('')
    });
    self.getListAccounts(1, self.filterValue);
  }

  getListAccounts(page, filter) {
    const self = this;
    self.accountService
      .getListAccounts(page, filter)
      .subscribe((v: any) => {
        if (v.returnMessage === 'SUCCESS') {
          self.listAccounts = v.data.listAccounts;
          self.currentPage = page;
          self.totalPage = v.data.numberOfPage;
        }
        if (v.returnMessage === 'ACCOUNT_NOT_FOUND') {
          self.listAccounts = [];
          self.currentPage = 1;
          self.totalPage = 1;
        }
      });
  }

  goToPage(value) {
    const self = this;
    self.getListAccounts(value, self.filterValue);
  }
  open(content) {
    const self = this;
    this.modalService
      .open(content, { size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  setRoleForUser(account, i) {
    const self = this;
    self.user = account;
    self.userIndex = i;
  }

  onChange(role) {
    const self = this;
    self.selectedRole = role;
  }

  changeRole() {
    const self = this;
    const value = {
      userId: self.user.id,
      role: self.selectedRole
    };
    self.accountService.modifyAccountRole(value).subscribe((v: any) => {
      if (v.returnMessage === 'SUCCESS') {
        swal({
          title: 'Congratulations',
          text: 'Change role successfully.',
          icon: 'success'
        }).then(() => {
          self.user.role = self.selectedRole;
          self.listAccounts[self.userIndex] = self.user;
        });
      }
    });
  }

  filter(value) {
    const self = this;
    self.filterValue = value;
    self.getListAccounts(1, self.filterValue);
  }
}
