import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

// This interface may be useful in the times ahead...
interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  id: number;
  state$: any;
  member = { firstName: '', lastName: '', jobTitle: '', team: null, status: null};
  isNew: boolean;
  constructor(private fb: FormBuilder, private appService: AppService, private router: Router, private location: Location) {}

  ngOnInit() {
      this.appService.getTeams().subscribe(teams => {this.teams = teams;});
      this.state$ = window.history.state;
      this.isNew = true;
      if (!!this.state$ && !!this.state$.member) {
          this.id = this.state$.member.id;
          this.member = this.state$.member;
          this.isNew = false;
      }
      this.populateForm(this.member);
  }

  populateForm(member) {
      this.memberForm = new FormGroup({
          firstName: new FormControl(member.firstName),
          lastName: new FormControl(member.lastName),
          jobTitle: new FormControl(member.jobTitle),
          team: new FormControl(member.team),
          status: new FormControl(member.status)
      });
  }

  ngOnChanges() {}

  onSubmit(form: FormGroup) {
    this.memberModel = form.value;
    if (this.isNew) {
        this.appService.addMember(this.memberModel);
    } else {
        this.appService.updateMember(this.memberModel, this.id);
    }
    this.router.navigate(['/members']);
  }
}
