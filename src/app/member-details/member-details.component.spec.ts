import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppService } from '../app.service';
import { MemberDetailsComponent } from './member-details.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {of} from 'rxjs';
import {Location, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';

// Bonus points!
describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;
  let appService: AppService;
  let spy: any;
  const formBuilder: FormBuilder = new FormBuilder();

    beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberDetailsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule
      ],
      providers: [
        HttpClient, Location, LocationStrategy,
          { provide: FormBuilder, useValue: formBuilder }, { provide: LocationStrategy, useClass: PathLocationStrategy },
          { provide: APP_BASE_HREF, useValue: '/my/app'},
        AppService,
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDetailsComponent);
      appService = TestBed.get(AppService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    window.history.pushState({ member: {firstName: 'Jason', lastName: 'Marc', team: 'Formula 1 - Car 8', jobTitle: 'driver', status: 'Active'}}, '', '');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component (edit member)', () => {
      const teams = {
            id: 2, team: 'Formula 1 - Car 8'
        };
      const member = {firstName: 'Jason', lastName: 'Marc', team: 'Formula 1 - Car 8', jobTitle: 'driver', status: 'Active'};
      spy = spyOn(appService, 'getTeams').and.returnValue(of(teams));
      spy = spyOn(component, 'populateForm');
      component.ngOnInit();
      expect(appService.getTeams).toHaveBeenCalled();
      expect(component.isNew).toBeFalsy();
      expect(window.history.state.member).toEqual(member);
      expect(component.populateForm).toHaveBeenCalledWith(member);
   });

    it('should initialize the component (new member)', () => {
    window.history.pushState({}, '', '');
    const teams = {
        id: 2, team: 'Formula 1 - Car 8'
    };
    const member = {firstName: 'Jason', lastName: 'Marc', team: 'Formula 1 - Car 8', jobTitle: 'driver', status: 'Active'};
    spy = spyOn(appService, 'getTeams').and.returnValue(of(teams));
    spy = spyOn(component, 'populateForm');
    component.ngOnInit();
    expect(appService.getTeams).toHaveBeenCalled();
    expect(component.isNew).toBeTruthy();
    expect(window.history.state.member).toBeUndefined();
    expect(component.populateForm).toHaveBeenCalledWith(member);
    });


it('should invoke populateForm', () => {
        const member = { firstName: 'Jason', lastName: 'Marc', team: 'Formula 1 - Car 8', title: 'Driver', status: 'Active'};
        component.populateForm(member);
        expect(component.memberForm).not.toBeUndefined();
});

it('should invoke submit method', () => {
    const member = { firstName: 'Jason', lastName: 'Marc', team: 'Formula 1 - Car 8', title: 'Driver', status: 'Active'};
    component.populateForm(member);
    expect(component.memberForm).not.toBeUndefined();
});


    it('submitting a form (add new member)', () => {
        component.memberForm = formBuilder.group({
            firstName: 'Jason',
            lastName: 'Marc',
            jobTitle: 'Driver',
            team: 'Formula 1 - Car 8',
            status: 'Active'
        });
        component.isNew = true;
        spy = spyOn(appService, 'addMember');
        component.onSubmit(component.memberForm);
        expect(component.memberModel).toBe(component.memberForm.value);
        expect(appService.addMember).toHaveBeenCalledWith(component.memberModel);
    });

    it('submitting a form (update existing member)', () => {
        component.memberForm = formBuilder.group({
            firstName: 'Jason',
            lastName: 'Marc',
            jobTitle: 'Driver',
            team: 'Formula 1 - Car 8',
            status: 'Active'
        });
        component.isNew = false;
        component.id = 12;
        spy = spyOn(appService, 'updateMember');
        component.onSubmit(component.memberForm);
        expect(component.memberModel).toBe(component.memberForm.value);
        expect(appService.updateMember).toHaveBeenCalledWith(component.memberModel, component.id);
    });

});
