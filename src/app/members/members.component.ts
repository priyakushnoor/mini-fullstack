import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members = [];

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
    this.appService.getMembers().subscribe(members => (this.members = members));
  }

  goToAddMemberForm() {
      this.router.navigate(['/member-details']);
  }

  editMember(member: any) {
        this.router.navigate(['/member-details'], { state: { member: member } });
  }

  deleteMemberById(id: number) {
      this.appService.deleteMember(id);
      this.members = this.members.filter(function(item) {
          return item.id !== id;
      });
    }
}
