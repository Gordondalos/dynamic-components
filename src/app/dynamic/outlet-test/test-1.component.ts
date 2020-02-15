import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { DynamicModule } from '@factory/utils';
import { CommonModule } from '@angular/common';
import { Interpolation } from '@angular/compiler';

@Component({
  selector: 'app-test-1',
  template: `
  <p>Link: {{ lable }}<p>
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  <div class="flex">
    <dynamic *ngFor="let child of children"
             [configs]="child"></dynamic>
    <div>
  `,
  styles: [`
    :host {
      background-color: orange;
      display: block;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #fff;
    }
    .flex {
      display: flex;
    }
    dynamic {
      flex: 1 0 auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test1Component {
  number = (Math.random() * 100).toFixed();

  @Input() children: any[];
  @Input() lable: string;
}


@NgModule({
  imports: [
    CommonModule,
    DynamicModule.forChild({
      types: [{
        name: 'test-1',
        component: Test1Component,
      }]
    }),
  ],
  declarations: [
    Test1Component
  ],
  entryComponents: [
    Test1Component,
  ],
  exports: [
    Test1Component,
  ],
})
export class Test1Module { }
