import { Component, OnInit, AfterViewInit, ViewEncapsulation, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { Helpers } from './../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';

import { GridOptions } from 'ag-grid';
import 'ag-grid-enterprise/main';

import { AgCellRenderer } from '../ag-editor/ag-cell-renderer/ag-cell-renderer.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-submit-editor-modal',
  templateUrl: './submit-editor-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SubmitEditorModalComponent implements OnInit, AfterViewInit {
  // @Input() private filterData: Array<any>;
  // @Input() private originalData: Array<any>;
  // @Output() public complete: EventEmitter<any> = new EventEmitter<any>();
  // @ViewChild('btnModalClose') public btnModalClose: ElementRef;

  selectedCategory: number;
  originalData: Array<any>;
  ruleData: Array<any>;
  gridData: Array<any>;
  gridColumnDefs: any;
  gridApi: any;
  gridColumnApi: any;

  getRowNodeId: any;
  private cellClassRulesState: any;
  private cellClassRulesChanged: any;
  gridOptions: any;
  private gridColumnDefsData: any;
  categoryData: any;
  countStatement: any;

  constructor(
    private _script: ScriptLoaderService,
    private _renderer: AgCellRenderer
  ) {
    this.gridData = [];

    // 상태값(state)에 따른 Cell 색상 rule 정의
    this.cellClassRulesState = {
      'ag-cell-state-changed': params => {
        return params.value === 'changed';
      },
      'ag-cell-state-added': params => {
        return params.value === 'added';
      },
      'ag-cell-state-removed': params => {
        return params.value === 'removed';
      }
    };
    // 에디팅 시 Cell 색상 rule 정의
    this.cellClassRulesChanged = {
      'ag-cell-changed': params => this.onCellChange(params)
    };
    // ID 변경(유니크값): row index -> (category_code + attack_code)
    this.getRowNodeId = data => {
      return data.id;
    };
    this.gridOptions = <GridOptions>{
      rowHeight: 35,
      headerHeight: 35,
      singleClickEdit: true,
      rowClassRules: {
        // 'ag-row-changed': (params) => this.onRowChange(params) // 중복 확인 필요 없음 (state값에 의존적)
        'ag-row-changed': params => params.data.state.length > 0
      },
      defaultColDef: {
        cellClass: [ 'text-center' ],
        cellClassRules: this.cellClassRulesChanged,
      }
    };
    this.gridColumnDefsData = {
      3: [
        {
          headerName: '',
          field: 'state',
          width: 44,
          pinned: 'left',
          suppressMenu: true,
          cellRenderer: this._renderer.rendererState,
          cellClassRules: this.cellClassRulesState,
        },
        {
          headerName: '행위',
          field: 'action',
          width: 90,
          pinned: 'left',
          cellRenderer: this._renderer.rendererAction,
        },
        {
          headerName: '공격코드',
          field: 'attack_code',
          width: 116,
          pinned: 'left',
        },
        {
          headerName: '공격유형',
          field: 'category_name',
          width: 124,
        },
        {
          headerName: '공격명',
          field: 'attack_name',
          width: 331,
          cellClass: [ 'text-left' ],
        },
        {
          headerName: '차단방법',
          field: 'method_code',
          width: 124,
          cellRenderer: this._renderer.rendererMethod,
        },
        {
          headerName: '위험도',
          field: 'risk_code',
          width: 103,
          cellRenderer: this._renderer.rendererRisk,
        },
        {
          headerName: '경보',
          field: 'alarm',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '메일',
          field: 'mail',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '예외IP',
          field: 'exceptip_count',
          width: 103
        },
        {
          headerName: '방향',
          field: 'flow_message',
          width: 90,
          cellRenderer: this._renderer.rendererFlow,
          cellClass: [ 'text-left' ],
        },
        {
          headerName: '공격인정횟수',
          field: 'attack_recognize_count',
          width: 142,
        },
        {
          headerName: '차단인정횟수',
          field: 'block_recognize_count',
          width: 142,
        },
        {
          headerName: '공격인정시간',
          field: 'attack_recognize_time',
          width: 142,
        },
        {
          headerName: '차단시간',
          field: 'block_time',
          width: 116,
        },
        {
          headerName: 'RAW',
          field: 'raw_message',
          width: 90,
          cellEditorParams: {
            values: [{ value: 'none', text: 'none' }, { value: 'single', text: 'single' }],
            title: 'RAW'
          }
        },
        {
          headerName: '공격자축약',
          field: 'summary_info_hacker_summary',
          width: 130,
        },
        {
          headerName: '대상자축약',
          field: 'summary_info_victim_summary',
          width: 130,
        },
        {
          headerName: '공격자축약(IPv6)',
          field: 'summary_info_hacker_summary_v6',
          width: 166,
        },
        {
          headerName: '대상자축약(IPv6)',
          field: 'summary_info_victim_summary_v6',
          width: 166,
        },
        {
          headerName: '임계치학습',
          field: 'threshold_study',
          width: 130,
          cellRenderer: this._renderer.rendererBoolean,
        }
      ],
      7: [
        {
          headerName: '',
          field: 'state',
          width: 44,
          pinned: 'left',
          suppressMenu: true,
          cellRenderer: this._renderer.rendererState,
          cellClassRules: this.cellClassRulesState
        },
        {
          headerName: '행위',
          field: 'action',
          width: 90,
          pinned: 'left',
          cellRenderer: this._renderer.rendererAction,
        },
        {
          headerName: '공격코드',
          field: 'attack_code',
          width: 116,
          pinned: 'left'
        },
        {
          headerName: '공격유형',
          field: 'category_name',
          width: 124,
        },
        {
          headerName: '공격명',
          field: 'attack_name',
          width: 331,
          cellClass: [ 'text-left' ],
        },
        {
          headerName: 'RateLimit방법',
          field: 'method_code',
          width: 124,
          cellRenderer: this._renderer.rendererMethod,
        },
        {
          headerName: '위험도',
          field: 'risk_code',
          width: 103,
          cellRenderer: this._renderer.rendererRisk,
        },
        {
          headerName: '경보',
          field: 'alarm',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '메일',
          field: 'mail',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '예외IP',
          field: 'exceptip_count',
          width: 103
        },
        {
          headerName: '방향',
          field: 'flow_message',
          width: 90,
          cellRenderer: this._renderer.rendererFlow,
          cellClass: [ 'text-left' ],
        },
        {
          headerName: '공격인정횟수',
          field: 'attack_recognize_count',
          width: 142,
        },
        {
          headerName: '공격인정시간',
          field: 'attack_recognize_time',
          width: 142,
        },
        {
          headerName: '차단시간',
          field: 'block_time',
          width: 116,
        },
        {
          headerName: '허용임계치',
          field: 'block_recognize_count',
          width: 116,
        },
        {
          headerName: 'RAW',
          field: 'raw_message',
          width: 90,
        },
        {
          headerName: '임계치학습',
          field: 'threshold_study',
          width: 130,
          cellRenderer: this._renderer.rendererBoolean,
        }
      ],
      1100: [
        {
          headerName: '',
          field: 'state',
          width: 44,
          pinned: 'left',
          suppressMenu: true,
          cellRenderer: this._renderer.rendererState,
          cellClassRules: this.cellClassRulesState
        },
        {
          headerName: '행위',
          field: 'action',
          width: 90,
          pinned: 'left',
          cellRenderer: this._renderer.rendererAction,
        },
        {
          headerName: '공격코드',
          field: 'attack_code',
          width: 116,
          pinned: 'left',
        },
        {
          headerName: '공격명',
          field: 'attack_name',
          width: 331,
          cellClass: ['text-left'],
        },
        {
          headerName: '차단방법',
          field: 'method_code',
          width: 124,
          cellRenderer: this._renderer.rendererMethod,
        },
        {
          headerName: '위험도',
          field: 'risk_code',
          width: 103,
          cellRenderer: this._renderer.rendererRisk,
        },
        {
          headerName: '경보',
          field: 'alarm',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '메일',
          field: 'mail',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '예외IP',
          field: 'exceptip_count',
          width: 103
        },
        {
          headerName: '방향',
          field: 'flow_message',
          width: 90,
          cellRenderer: this._renderer.rendererFlow,
          cellClass: ['text-left'],
        },
        {
          headerName: '공격인정횟수',
          field: 'attack_recognize_count',
          width: 142,
        },
        {
          headerName: '차단인정횟수',
          field: 'block_recognize_count',
          width: 142,
        },
        {
          headerName: '공격인정시간',
          field: 'attack_recognize_time',
          width: 142,
        },
        {
          headerName: '차단시간',
          field: 'block_time',
          width: 116,
        },
        {
          headerName: 'RAW',
          field: 'raw_message',
          width: 90,
        },
        {
          headerName: '프로토콜',
          field: 'protocol_message'
        },
        {
          headerName: '포트',
          field: 'port'
        },
        {
          headerName: 'Flow',
          field: 'reqrsp_message'
        },
        {
          headerName: '공격자축약',
          field: 'summary_info_hacker_summary',
          width: 130,
        },
        {
          headerName: '대상자축약',
          field: 'summary_info_victim_summary',
          width: 130,
        },
        {
          headerName: '공격자축약(IPv6)',
          field: 'summary_info_hacker_summary_v6',
          width: 166,
        },
        {
          headerName: '대상자축약(IPv6)',
          field: 'summary_info_victim_summary_v6',
          width: 166,
        },
        {
          headerName: '임계치학습',
          field: 'threshold_study',
          width: 130,
          cellRenderer: this._renderer.rendererBoolean,
        }
      ],
      1500: [
        {
          headerName: '',
          field: 'state',
          width: 44,
          pinned: 'left',
          suppressMenu: true,
          cellRenderer: this._renderer.rendererState,
          cellClassRules: this.cellClassRulesState
        },
        {
          headerName: '행위',
          field: 'action',
          width: 90,
          pinned: 'left',
          cellRenderer: this._renderer.rendererAction,
        },
        {
          headerName: '공격코드',
          field: 'attack_code',
          width: 116,
          pinned: 'left'
        },
        {
          headerName: '공격유형',
          field: 'category_name',
          width: 124,
        },
        {
          headerName: '공격명',
          field: 'attack_name',
          width: 331,
          cellClass: [ 'text-left' ],
        },
        {
          headerName: '차단방법',
          field: 'method_code',
          width: 124,
          cellRenderer: this._renderer.rendererMethod,
        },
        {
          headerName: '위험도',
          field: 'risk_code',
          width: 103,
          cellRenderer: this._renderer.rendererRisk,
        },
        {
          headerName: '경보',
          field: 'alarm',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '메일',
          field: 'mail',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '예외IP',
          field: 'exceptip_count',
          width: 103
        },
        {
          headerName: '방향',
          field: 'flow_message',
          width: 90,
          cellRenderer: this._renderer.rendererFlow,
          cellClass: [ 'text-left' ],
        },
        {
          headerName: '공격인정횟수',
          field: 'attack_recognize_count',
          width: 142,
        },
        {
          headerName: '차단인정횟수',
          field: 'block_recognize_count',
          width: 142,
        },
        {
          headerName: '공격인정시간',
          field: 'attack_recognize_time',
          width: 142,
        },
        {
          headerName: '차단시간',
          field: 'block_time',
          width: 116,
        },
        {
          headerName: 'RAW',
          field: 'raw_message',
          width: 90,
        },
        {
          headerName: '패턴',
          field: 'pattern_info_pattern'
        },
        {
          headerName: '유형',
          field: 'pattern_info_type'
        },
        {
          headerName: '프로토콜',
          field: 'protocol_message'
        },
        {
          headerName: '포트',
          field: 'port'
        },
        {
          headerName: 'Flow',
          field: 'reqrsp_message'
        },
        {
          headerName: '대소문자 비교',
          field: 'nocase',
          cellRenderer: this._renderer.rendererBoolean,
        },
        {
          headerName: '옵셋값',
          field: 'offset_info_offset'
        },
        {
          headerName: '옵셋비교',
          field: 'offset_info_offset_flag'
        },
        {
          headerName: '공격자축약',
          field: 'summary_info_hacker_summary',
          width: 130,
        },
        {
          headerName: '대상자축약',
          field: 'summary_info_victim_summary',
          width: 130,
        },
        {
          headerName: '공격자축약(IPv6)',
          field: 'summary_info_hacker_summary_v6',
          width: 166,
        },
        {
          headerName: '대상자축약(IPv6)',
          field: 'summary_info_victim_summary_v6',
          width: 166,
        },
        {
          headerName: '임계치학습',
          field: 'threshold_study',
          width: 130,
          cellRenderer: this._renderer.rendererBoolean,
        }
      ]
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  init(filterData: any, countStatement: any, categoryData: any) {
    const categoryKeys = Object.keys(filterData);

    const concatData = [];
    const category = [];
    categoryKeys.forEach((key, idx) => {
      category.push(this.selectCodeInCategoryData(key, categoryData));
      category[idx]['count'] = filterData[key].length;
    });

    this.ruleData = filterData;
    this.categoryData = category;
    this.countStatement = countStatement;

    this.selectedCategory = Number(this.categoryData[0]['categoryCode']);

    this.loadItem();
  }

  onChangeCategory(categoryCode: string) {
    this.selectedCategory = Number(categoryCode);
    this.loadItem();
  }

  private selectCodeInCategoryData(code: string, categoryData: any) {
    let selectedData = [];

    selectedData = categoryData.filter((row, index) => {
      return row.categoryCode === code;
    });

    return selectedData[0];
  }

  private loadItem() {
    const idx = this.selectedCategory;
    this.gridData = this.ruleData[idx];

    this.gridColumnDefs = this.getColumnDefs();
    this.gridApi.setRowData(this.gridData);
    this.gridApi.redrawRows();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridColumnDefs = this.getColumnDefs();
    this.gridApi.setRowData(this.gridData);
    this.gridApi.redrawRows();
  }

  private onCellChange(params: any) {
    return this.checkChangingData('cell', params);
  }

  private checkChangingData(type: string, params: any): boolean {
    let flag = false;
    let thisData, originalData, prevState;

    switch (type) {
      case 'row':
        // 비교 시 임시 초기화
        prevState = params.data.state.toString();
        params.data.state = '';

        thisData = JSON.stringify(params.data);
        originalData = JSON.stringify(
          this.selectIDInData(params.node.id, this.countStatement['changed'])
        ); // category+attck code가 node id 일 때
        const isAdded = params.data.isAdded ? params.data.isAdded : false;
        const isRemoved = params.data.isRemoved ? params.data.isRemoved : false;
        flag = thisData !== originalData && !isAdded && !isRemoved ? true : false;

        // 임시 초기화 값 복원
        params.data.state = prevState;
        break;
      case 'cell':
        thisData = params.data[params.colDef.field];
        const originalDataRow = this.selectIDInData(params.node.id, this.countStatement['changed']);
        if (originalDataRow !== -1) {
          originalData = originalDataRow['original_data'][params.colDef.field];
          if (typeof originalData !== 'undefined') {
            flag = thisData !== originalData ? true : false;
          }
        }
        break;
    }

    return flag;
  }

  private selectIDInData(id: string, data: any) {
    let selectedData = [];

    selectedData = data.filter((row, index) => {
      return row.id === id;
    });

    if (selectedData.length > 0) {
      return selectedData[0];
    } else {
      return -1;
    }
  }

  getColumnDefs() {
    const category = this.selectedCategory;
    let columnDefs = [];

    switch (category) {
      // 3: 프로토콜 취약점
      case 3:
        columnDefs = this.gridColumnDefsData[3];
        break;
      // 7: RateLimit(Dynamic)
      case 7:
        columnDefs = this.gridColumnDefsData[7];
        break;
      // 1100: 패턴블럭
      case 1100:
        columnDefs = this.gridColumnDefsData[1100];
        break;
      // 1500: 사용자정의 패턴블럭
      case 1500:
        columnDefs = this.gridColumnDefsData[1500];
        break;
      default:
        columnDefs = [];
        break;
    }

    return columnDefs;
  }
}
