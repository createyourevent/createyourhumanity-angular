import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, inject } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { FormulaDataService } from 'app/entities/formula-data/service/formula-data.service';
import { MaincontrollerService } from 'app/maincontroller.service';
import { IUser } from 'app/entities/user/user.model';
import { FormulaData } from 'app/entities/formula-data/formula-data.model';

export interface Keyword {
  name: string;
}

/**
 * @title Keyword input
 */
@Component({
  selector: 'keyword-input-example',
  template: `
  <mat-form-field class="keywords-chip-list">
  <mat-label>Keywords</mat-label>
  <mat-chip-grid #chipGrid aria-label="Enter keywords">
    <mat-chip-row *ngFor="let keyword of keywords; let i = index" (removed)="remove(keyword)" [editable]="true"
      (edited)="edit(keyword, $event)" [aria-description]="'press enter to edit ' + keyword.name">
      {{ keyword.name }}
      <button matChipRemove [attr.aria-label]="'remove ' + keyword.name">
        <mat-icon>cancel</mat-icon>
      </button>
    </mat-chip-row>
    <input placeholder="New keyword..." [matChipInputFor]="chipGrid" [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
      [matChipInputAddOnBlur]="addOnBlur" (matChipInputTokenEnd)="add($event)" />
  </mat-chip-grid>
</mat-form-field>
  `,
  standalone: true,
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule, CommonModule],
})
export class ChipsComponent  extends FieldType<FieldTypeConfig> implements OnInit {

  account: IUser;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  keywords: Keyword[] = [];
  announcer = inject(LiveAnnouncer);
  formulaData: FormulaData;


  constructor(private formulaDataService: FormulaDataService,
              private maincontrollerService: MaincontrollerService,
  ){
    super();
  }

  ngOnInit(): void {
    console.log(this.field.id);
    this.maincontrollerService.findAuthenticatedUser().subscribe(res => {
      this.account = res.body;
      this.maincontrollerService.findFormulaDataByUserId(this.account.id).subscribe(data => {
        this.formulaData = data.body || new FormulaData();
        this.keywords = this.extractKeywordsFromMap(this.formulaData.map || {}, this.field.id);
      });
    });
  }

  private extractKeywordsFromMap(map: { [key: string]: string }, fieldId: string): Keyword[] {
    const keywords = map[fieldId] ? map[fieldId].split(',') : [];
    return keywords.map(keyword => ({ name: keyword.trim() }));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    // Füge den neuen Wert nur hinzu, wenn er nicht leer ist und noch nicht existiert
    if (value && !this.keywords.some(keyword => keyword.name === value)) {
      this.keywords.push({ name: value });
      if (this.formulaData && this.formulaData.map) {
        if (!this.formulaData.map[this.field.id]) {
          this.formulaData.map[this.field.id] = '';
        }
        this.formulaData.map[this.field.id] = this.keywords.map(keyword => keyword.name).join(',');
        this.formulaDataService.update(this.formulaData).subscribe(data => {
          this.formulaData = data.body;
          // Leere das Eingabefeld, nachdem der neue Wert hinzugefügt wurde
          input.value = '';
          input.blur();
        });
      }
    }
    // Verhindere, dass der Standard-Chip-Eintrag hinzugefügt wird
    if (input) {
      input.value = '';
    }
  }
  remove(keyword: Keyword): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
      this.announcer.announce(`Removed ${keyword.name}`);
      this.updateKeywordsInMap();
    }
  }

  edit(keyword: Keyword, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove keyword if it no longer has a name
    if (!value) {
      this.remove(keyword);
      return;
    }

    // Edit existing keyword
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords[index].name = value;
      this.updateKeywordsInMap();
    }
  }

  private updateKeywordsInMap(): void {
    if (this.formulaData && this.formulaData.map) {
      this.formulaData.map[this.field.id] = this.keywords.map(keyword => keyword.name).join(',');
      this.formulaDataService.update(this.formulaData).subscribe(data => {
        this.formulaData = data.body;
      });
    }
  }
}
