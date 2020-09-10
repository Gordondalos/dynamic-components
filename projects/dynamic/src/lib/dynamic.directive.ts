import {
  Compiler,
  Directive,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { from, of, Subject } from 'rxjs';
import { filter, map, mergeAll, switchMap, tap } from 'rxjs/operators';

import { DYNAMIC_TYPES_MAP } from './dynamic.injection-tolens';
import { NgModulePortal } from './portals/ng-module';

interface TypeOption {
  type: string;
}

@Directive({
  selector: '[dynamic]',
})
export class DynamicDirective implements OnChanges, OnDestroy {

  @Input('dynamic') typeOptions: TypeOption[];

  typeOptions$ = new Subject<TypeOption[]>();

  subscription = this.typeOptions$
    .pipe(
      tap(() => {
        this.viewContainerRef.clear();
      }),
      switchMap((typeOptions) =>
        typeOptions.map((typeOption, index) =>
          componentCreater(typeOption, index, this.typesMap, this.compiler, this.injector),
      )),
      mergeAll(),
    )
    .subscribe(({ component, index }) => {
      const componentRef = component.createComponent();

      const tempIndex = this.viewContainerRef.length < index
        ? this.viewContainerRef.length
        : index;

      this.viewContainerRef.insert(componentRef.hostView, tempIndex);

      componentRef.changeDetectorRef.markForCheck();
    });

  constructor(
    private readonly compiler: Compiler,
    private readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
    @Inject(DYNAMIC_TYPES_MAP) private readonly typesMap: Map<string, NgModulePortal<any>>,
  ) { }

  ngOnChanges({ typeOptions }: SimpleChanges): void {
    if (typeOptions) {
      this.typeOptions$.next(this.typeOptions);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.viewContainerRef.clear();
  }
}

export const componentCreater = (
  typeOption: TypeOption,
  index: number,
  typesMap: Map<string, NgModulePortal<any>>,
  compiler: Compiler,
  injector: Injector,
) => of(typeOption).pipe(
  map((option) => typesMap.get(option?.type)),
  filter((holder) => !!holder),
  switchMap((holder) => from(holder.compile(compiler))),
  map((holder) => {
    const moduleRef = holder.create(injector);
    const component = moduleRef.components.get(typeOption.type).createFactory();

    return { component, index };
  }),
);
