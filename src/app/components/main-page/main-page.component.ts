import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WeatherService } from 'src/app/service/weather.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  formDataArr: any[] = [];
  selectedFormData: any;
  selectedFormIndex: number = -1;
  submitted: boolean = false;
  weatherData: any;
  searchControl = new FormControl();
  filteredFormDataArr: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private service: WeatherService) { }

  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[^0-9]*$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[^0-9]*$/)]],
    income: ['', [Validators.required, Validators.pattern(/^\d+\.\d{2}$/), Validators.min(0.01)]],
    image: ['']
  });

  ngOnInit() {
    this.getData();
    //get weather data
    this.service.getWeatherByLocation().subscribe((data: any) => {
      this.weatherData = data;
      console.log(data)
    });
    //search
    this.searchControl.valueChanges.subscribe(value => {
      console.log(this.filteredFormDataArr)
      if (value === '') {
        this.getData();
      } else {
        this.formDataArr = this.formDataArr.filter(f => {
          return f.firstName.toLowerCase().includes(value.toLowerCase()) ||
                 f.lastName.toLowerCase().includes(value.toLowerCase());
        });
      }
    });
  }
  

  getData() {
    const savedData = localStorage.getItem('formData');
    this.formDataArr = savedData ? JSON.parse(savedData) : [];
  }

  Add() {
    this.submitted = true;
    // add formValue to localStorage if form is valid
    if (this.profileForm.valid) {
      const id = this.generateUniqueId();
      const savedData = localStorage.getItem('formData');
      let dataArr = savedData ? JSON.parse(savedData) : [];
      const formData = {
        id,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        income: this.profileForm.value.income,
        image: this.profileForm.value.image || null,
        score: 0 
      };
      //calculate score
      const firstNameScore = formData.firstName.toUpperCase().split('').reduce((acc:number, curr:string) => acc + curr.charCodeAt(0) - 64, 0);
      const incomeScore = parseFloat(formData.income) * 1.5;
      formData.score = firstNameScore + incomeScore;
      dataArr.push(formData);
      localStorage.setItem('formData', JSON.stringify(dataArr));
      this.profileForm.reset();
      this.getData();
    }
  }

  editForm(formData: any, index: number) {
    this.profileForm.setValue({
      firstName: formData.firstName,
      lastName: formData.lastName,
      income: formData.income,
      image: formData.image
    });
    this.selectedFormIndex = index;
  }

  Save() {
    if (this.selectedFormIndex !== -1) {
      const savedData = localStorage.getItem('formData');
      let dataArr = savedData ? JSON.parse(savedData) : [];
      const selectedFormData = dataArr[this.selectedFormIndex];
      const updatedFormData = {
        ...this.profileForm.value,
        id: selectedFormData.id,
        score: 0
      };
      const firstNameScore = updatedFormData.firstName.toUpperCase().split('').reduce((acc:number, curr:string) => acc + curr.charCodeAt(0) - 64, 0);
      const incomeScore = parseFloat(updatedFormData.income) * 1.5;
      updatedFormData.score = firstNameScore + incomeScore;
      dataArr[this.selectedFormIndex] = updatedFormData;
      localStorage.setItem('formData', JSON.stringify(dataArr));
      this.selectedFormIndex = -1;
      this.getData();
    }
  }

  deleteForm(index: number) {
    const savedData = localStorage.getItem('formData');
    let dataArr = savedData ? JSON.parse(savedData) : [];
    dataArr.splice(index, 1);
    localStorage.setItem('formData', JSON.stringify(dataArr));
    this.getData();
  }

   generateUniqueId(): number {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    const id = parseInt(`${timestamp}${random}`);
    return id;
  }



  goToDetailPage(formData: any) {
    console.log(formData)
    this.router.navigate(['/detail', formData.id], { state: { data: formData } });
  }
  

  getWeatherIcon(conditionCode: number) {
    if (conditionCode >= 200 && conditionCode < 300) {
      return 'fas fa-bolt';
    } else if (conditionCode >= 300 && conditionCode < 600) {
      return 'fas fa-cloud-rain';
    } else if (conditionCode >= 600 && conditionCode < 700) {
      return 'fas fa-snowflake';
    } else if (conditionCode >= 700 && conditionCode < 800) {
      return 'fas fa-smog';
    } else if (conditionCode === 800) {
      return 'fas fa-sun';
    } else if (conditionCode > 800 && conditionCode < 900) {
      return 'fas fa-cloud';
    } else {
      return 'fas fa-question';
    }
  }

  sortData(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
  
    if (selectedValue === 'firstName') {
      this.formDataArr.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (selectedValue === 'lastName') {
      this.formDataArr.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (selectedValue === 'income') {
      this.formDataArr.sort((a, b) => parseFloat(a.income) - parseFloat(b.income));
    }
  }
  
  
}


