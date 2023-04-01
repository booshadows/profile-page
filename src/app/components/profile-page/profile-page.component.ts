import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  formData: any;

  constructor() { }

  ngOnInit(): void {
    this.formData = history.state.data;
  }

  calculateScore(formData: any) {
    const firstNameScore = formData.firstName.toLowerCase().split('').reduce((acc: number, curr: string) => acc + curr.charCodeAt(0) - 96, 0);
    return firstNameScore;
    }

}
