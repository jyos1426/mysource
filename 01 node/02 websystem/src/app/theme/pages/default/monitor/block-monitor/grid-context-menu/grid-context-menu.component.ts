import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  Renderer2,
  TemplateRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GridComponent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'grid-context-menu',
  templateUrl: 'grid-context-menu.component.html',
  styleUrls: ['grid-context-menu.component.scss']
})
export class GridContextMenuComponent implements OnDestroy {
  @ContentChild(TemplateRef) public menuItemTemplate: TemplateRef<any>;

  @Input() public menuItems: any[] = [];

  @Output() public select: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  public set for(grid: GridComponent) {
    this.unsubscribe();
    this.cellClickSubscription = grid.cellClick.subscribe(this.onCellClick);
  }
  private contexttypeSubscription: Subscription;
  private cellClickSubscription: Subscription;

  public documentClickSubscription: any;
  public show: boolean;
  public dataItem: any;
  public offset: any;

  constructor(private renderer: Renderer2) {
    this.onCellClick = this.onCellClick.bind(this);
    this.documentClickSubscription = this.renderer.listen(
      'document',
      'click',
      () => {
        this.show = false;
      }
    );
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
    this.documentClickSubscription();
  }

  public menuItemSelected(item: any): void {
    this.select.emit({ item: item, dataItem: this.dataItem });
  }

  private onCellClick({ dataItem, type, originalEvent }): void {
    if ((type === 'contextmenu') && (Object.keys(dataItem).length > 0)) {
      originalEvent.preventDefault();
      this.dataItem = dataItem;
      this.show = true;
      this.offset = { left: originalEvent.pageX, top: originalEvent.pageY };

      console.log(this.dataItem, this.show, this.offset);
    }
  }

  private unsubscribe(): void {
    if (this.cellClickSubscription) {
      this.cellClickSubscription.unsubscribe();
      this.cellClickSubscription = null;
    }
  }
}
