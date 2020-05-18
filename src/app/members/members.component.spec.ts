import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MembersComponent } from './members.component';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;
  let appService: AppService;
  let spy: any;
    beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembersComponent],
      imports: [HttpClientModule, RouterModule],
      providers: [ AppService, {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    appService = TestBed.get(AppService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should initialize the component', () => {
        const responseObj = {
            id: 2, team: 'Formula 1 - Car 8', firstName : 'Jason', lastName: 'Marc'
        };
        spy = spyOn(appService, 'getMembers').and.returnValue(of(responseObj));
        component.ngOnInit();
        expect(appService.getMembers).toHaveBeenCalled();
    });

    it('should go add-member page', inject([Router], (router: Router) => {
        component.goToAddMemberForm();
        expect(router.navigate).toHaveBeenCalledWith(['/member-details']);
    }));

    it('should go edit member page', inject([Router], (router: Router) => {
        const member = { 'firstName': 'Jason', 'lastName': 'Marc', 'team': 'Formula 1 - Car 8', 'title': 'driver'};
        component.editMember(member);
        expect(router.navigate).toHaveBeenCalled();
    }));

    it('should invoke deleteMemberById', () => {
        const id = 2;
        component.members = [{ 'id': 1, 'firstName': 'Jason', 'lastName': 'Marc', 'team': 'Formula 1 - Car 8', 'title': 'driver'},
            { 'id': 2,  'firstName': 'Joana', 'lastName': 'Rana', 'team': 'Formula 1 - Car 8', 'title': 'driver'}];
        spy = spyOn(appService, 'deleteMember');
        component.deleteMemberById(id);
        expect(appService.deleteMember).toHaveBeenCalled();
        expect(component.members).toEqual([{ 'id': 1, 'firstName': 'Jason', 'lastName': 'Marc', 'team': 'Formula 1 - Car 8', 'title': 'driver'}]);
    });

});
