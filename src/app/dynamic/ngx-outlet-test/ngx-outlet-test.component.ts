import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'ngx-outlet-test',
  templateUrl: 'ngx-outlet-test.component.html',
  styleUrls: ['ngx-outlet-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxOutletTestComponent {

  sectionConfig: any = config1;

  private alternativeSectionConfig = config2;

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  toggle(): void {
    const temp = this.sectionConfig;
    this.sectionConfig = this.alternativeSectionConfig;
    this.alternativeSectionConfig = temp;

    this.cd.markForCheck();
  }
}

const config1 = [
  {
    type: 'test-orange',
    lable: 1,
    children: [
      [
        {
          type: 'test-green',
          lable: 2,
        },
      ],
    ],
  },
  {
    type: 'test-orange',
    lable: 3,
    children: [
      [
        {
          type: 'test-green',
          lable: 4,
        },
      ],
    ],
  },
  {
    type: 'test-blue',
    lable: 5,
  },
];

const config2 = [
  {
    type: 'test-blue',
    children: [
      { type: 'test-orange' },
    ],
  },
  {
    type: 'test-green',
  },
  {
    type: 'test-orange',
    children: [
      [
        {
          type: 'test-green',
        },
      ],
    ],
  },
];