import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ADDRESS_REGEX } from 'app/constants';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  formattedaddress = '';

  settingsForm = this.fb.group({
    address: [
      undefined,
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        Validators.pattern(ADDRESS_REGEX)
      ]
    ],
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    console.log('Hallo');
  }

  public addressChange(address: any): void {
    this.formattedaddress = address.formatted_address;
  }

}
