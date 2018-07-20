import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Helpers } from './../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { PtEditorService } from './_services/pt-editor.service';

// import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { GridOptions } from 'ag-grid';
import 'ag-grid-enterprise/main';

import { AgCellRenderer } from './ag-editor/ag-cell-renderer/ag-cell-renderer.service';

import { AgSelectEditorComponent } from './ag-editor/ag-select-editor/ag-select-editor.component';
import { AgNumericEditorComponent } from './ag-editor/ag-numeric-editor/ag-numeric-editor.component';
import { AgTextEditorComponent } from './ag-editor/ag-text-editor/ag-text-editor.component';
import { AgBooleanEditorComponent } from './ag-editor/ag-boolean-editor/ag-boolean-editor.component';

import { TreeNode } from 'primeng/primeng';

import { SubmitEditorModalComponent } from './submit-editor-modal/submit-editor-modal.component';
import { Router, ActivatedRoute, Params } from '@angular/router';

/**
 * 전제조건:
 * - 유니크 키는 카테고리코드(5자리) + 공격코드(5자리) 임  ex) "0000300037"
 * - 카테고리 코드(공격유형코드)와 공격코드는 절대 수정이 불가능함 (셀 수정에 따른 메모리 데이터 확인 시 의존적임)
 */
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './pt-editor.component.html',
  styleUrls: ['./pt-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PtEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('submitEditorModal') submitEditorModal: SubmitEditorModalComponent;
  @ViewChild('pTree') pTree: TreeNode;
  gridOptions: GridOptions;
  gridColumnDefs: any;
  gridColumnDefsData: any;
  getRowNodeId: any;
  private gridApi: any;
  private gridColumnApi: any;

  originalData: Array<any>;
  private ruleData: Array<any>;
  filterData: Array<any>;
  gridData: Array<any>;

  selectedCategory: number;
  categoryData: Array<any>;
  templateData: Array<any>;
  categoryCommonItems: Array<any>;
  categoryTemplateItems: Array<any>;
  categoryNodes: TreeNode[];
  selectedCategory2: any;
  private cellClassRulesState: any;
  private cellClassRulesChanged: any;

  stateFiltered: boolean;
  stateRefreshing: boolean;

  countStatement: any;
  private template_id: string;

  // private isNew: boolean;
  constructor(
    private _script: ScriptLoaderService,
    private _ptEditorService: PtEditorService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _renderer: AgCellRenderer
  ) {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.template_id = params.template_id || undefined;
    });
    // this.isNew = true;
    this.selectedCategory = 3;
    this.stateFiltered = false;
    this.stateRefreshing = false;
    this.countStatement = {
      changed: [],
      added: [],
      removed: []
    };

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
      suppressAnimationFrame: true,
      // rowBuffer: 12,
      rowClassRules: {
        // 'ag-row-changed': (params) => this.onRowChange(params) // 중복 확인 필요 없음 (state값에 의존적)
        'ag-row-changed': params => params.data.state.length > 0
      },
      defaultColDef: {
        // headerClass: [ 'text-center' ], // 안먹네?
        cellClass: ['text-center'],
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: 'pass', text: '미탐' },
              { value: 'detect', text: '탐지' },
              { value: 'block', text: '차단' }
            ],
            title: '행위'
          },
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: '1', text: 'SN_SRC_IP' },
              { value: '2', text: 'SN_DST_IP' },
              { value: '8', text: 'SN_AND_IP' },
              { value: '256', text: 'SN_SRC_SERV' },
              { value: '512', text: 'SN_DST_SERV' }
            ],
            title: '차단방법'
          },
          headerClass: 'text-center',
          cellClass: 'text-center',
        },
        {
          headerName: '위험도',
          field: 'risk_code',
          width: 103,
          cellRenderer: this._renderer.rendererRisk,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: 0, text: '낮음' }, { value: 1, text: '보통' }, { value: 2, text: '높음' }],
            title: '위험도'
          }
        },
        {
          headerName: '경보',
          field: 'alarm',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
        },
        {
          headerName: '메일',
          field: 'mail',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: 'all', text: '전체' },
              { value: 'inbound', text: 'InBound' },
              { value: 'outbound', text: 'OutBound' }
            ],
            title: '방향'
          },
          cellClass: ['text-left'],
        },
        {
          headerName: '공격인정횟수',
          field: 'attack_recognize_count',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '차단인정횟수',
          field: 'block_recognize_count',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '공격인정시간',
          field: 'attack_recognize_time',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '차단시간',
          field: 'block_time',
          width: 116,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: 'RAW',
          field: 'raw_message',
          width: 90,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: 'none', text: 'none' }, { value: 'single', text: 'single' }],
            title: 'RAW'
          }
        },
        {
          headerName: '공격자축약',
          field: 'summary_info_hacker_summary',
          width: 130,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '대상자축약',
          field: 'summary_info_victim_summary',
          width: 130,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '공격자축약(IPv6)',
          field: 'summary_info_hacker_summary_v6',
          width: 166,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '대상자축약(IPv6)',
          field: 'summary_info_victim_summary_v6',
          width: 166,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '임계치학습',
          field: 'threshold_study',
          width: 130,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: 'pass', text: '미탐' },
              { value: 'detect', text: '탐지' },
              { value: 'block', text: '차단' }
            ],
            title: '행위'
          }
        },
        {
          headerName: '공격코드',
          field: 'attack_code',
          width: 116,
          pinned: 'left'
        },
        {
          headerName: '공격명',
          field: 'attack_name',
          width: 331,
          cellClass: ['text-left'],
        },
        {
          headerName: 'RateLimit방법',
          field: 'method_code',
          width: 124,
          cellRenderer: this._renderer.rendererMethod,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: '16385', text: 'SN_RATELIMIT_PPS' }],
            title: 'RateLimit방법'
          }
        },
        {
          headerName: '위험도',
          field: 'risk_code',
          width: 103,
          cellRenderer: this._renderer.rendererRisk,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: 0, text: '낮음' }, { value: 1, text: '보통' }, { value: 2, text: '높음' }],
            title: '위험도'
          }
        },
        {
          headerName: '경보',
          field: 'alarm',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
        },
        {
          headerName: '메일',
          field: 'mail',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: 'all', text: '전체' },
              { value: 'inbound', text: 'InBound' },
              { value: 'outbound', text: 'OutBound' }
            ],
            title: '방향'
          },
          cellClass: ['text-left'],
        },
        {
          headerName: '공격인정횟수',
          field: 'attack_recognize_count',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '공격인정시간',
          field: 'attack_recognize_time',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '차단시간',
          field: 'block_time',
          width: 116,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '허용임계치',
          field: 'block_recognize_count',
          width: 116,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: 'RAW',
          field: 'raw_message',
          width: 90,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: 'none', text: 'none' }, { value: 'single', text: 'single' }],
            title: 'RAW'
          }
        },
        {
          headerName: '임계치학습',
          field: 'threshold_study',
          width: 130,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: 'pass', text: '미탐' },
              { value: 'detect', text: '탐지' },
              { value: 'block', text: '차단' }
            ],
            title: '행위'
          }
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: '1', text: 'SN_SRC_IP' },
              { value: '2', text: 'SN_DST_IP' },
              { value: '8', text: 'SN_AND_IP' },
              { value: '256', text: 'SN_SRC_SERV' },
              { value: '512', text: 'SN_DST_SERV' }
            ],
            title: '차단방법'
          }
        },
        {
          headerName: '위험도',
          field: 'risk_code',
          width: 103,
          cellRenderer: this._renderer.rendererRisk,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: 0, text: '낮음' }, { value: 1, text: '보통' }, { value: 2, text: '높음' }],
            title: '위험도'
          }
        },
        {
          headerName: '경보',
          field: 'alarm',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
        },
        {
          headerName: '메일',
          field: 'mail',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: 'all', text: '전체' },
              { value: 'inbound', text: 'InBound' },
              { value: 'outbound', text: 'OutBound' }
            ],
            title: '방향'
          },
          cellClass: ['text-left'],
        },
        {
          headerName: '공격인정횟수',
          field: 'attack_recognize_count',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '차단인정횟수',
          field: 'block_recognize_count',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '공격인정시간',
          field: 'attack_recognize_time',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '차단시간',
          field: 'block_time',
          width: 116,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: 'RAW',
          field: 'raw_message',
          width: 90,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: 'none', text: 'none' }, { value: 'single', text: 'single' }],
            title: 'RAW'
          }
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
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '대상자축약',
          field: 'summary_info_victim_summary',
          width: 130,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '공격자축약(IPv6)',
          field: 'summary_info_hacker_summary_v6',
          width: 166,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '대상자축약(IPv6)',
          field: 'summary_info_victim_summary_v6',
          width: 166,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '임계치학습',
          field: 'threshold_study',
          width: 130,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: 'pass', text: '미탐' },
              { value: 'detect', text: '탐지' },
              { value: 'block', text: '차단' }
            ],
            title: '행위'
          }
        },
        {
          headerName: '공격코드',
          field: 'attack_code',
          width: 116,
          pinned: 'left'
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: '1', text: 'SN_SRC_IP' },
              { value: '2', text: 'SN_DST_IP' },
              { value: '8', text: 'SN_AND_IP' },
              { value: '256', text: 'SN_SRC_SERV' },
              { value: '512', text: 'SN_DST_SERV' }
            ],
            title: '차단방법'
          }
        },
        {
          headerName: '위험도',
          field: 'risk_code',
          width: 103,
          cellRenderer: this._renderer.rendererRisk,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: 0, text: '낮음' }, { value: 1, text: '보통' }, { value: 2, text: '높음' }],
            title: '위험도'
          }
        },
        {
          headerName: '경보',
          field: 'alarm',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
        },
        {
          headerName: '메일',
          field: 'mail',
          width: 90,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
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
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [
              { value: 'all', text: '전체' },
              { value: 'inbound', text: 'InBound' },
              { value: 'outbound', text: 'OutBound' }
            ],
            title: '방향'
          },
          cellClass: ['text-left'],
        },
        {
          headerName: '공격인정횟수',
          field: 'attack_recognize_count',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '차단인정횟수',
          field: 'block_recognize_count',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '공격인정시간',
          field: 'attack_recognize_time',
          width: 142,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '차단시간',
          field: 'block_time',
          width: 116,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: 'RAW',
          field: 'raw_message',
          width: 90,
          editable: true,
          cellEditorFramework: AgSelectEditorComponent,
          cellEditorParams: {
            values: [{ value: 'none', text: 'none' }, { value: 'single', text: 'single' }],
            title: 'RAW'
          }
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
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
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
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '대상자축약',
          field: 'summary_info_victim_summary',
          width: 130,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '공격자축약(IPv6)',
          field: 'summary_info_hacker_summary_v6',
          width: 166,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '대상자축약(IPv6)',
          field: 'summary_info_victim_summary_v6',
          width: 166,
          editable: true,
          cellEditorFramework: AgNumericEditorComponent
        },
        {
          headerName: '임계치학습',
          field: 'threshold_study',
          width: 130,
          cellRenderer: this._renderer.rendererBoolean,
          editable: true,
          cellEditorFramework: AgBooleanEditorComponent
        }
      ]
    };

    this.gridColumnDefs = [];

    this.ruleData = [];
    this.gridData = [];

    this.getPolicyReferenceList();
    // this.getRuleData(); // onGridReady 시에 호출됨
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper', 'assets/app/js/policy-pt-editor.js');
  }

  changeCategory(e: any) {
    this.selectedCategory = Number(this.selectedCategory2.data.code);
    this.loadItem();
  }

  loadItem() {
    const idx = this.selectedCategory;
    this.gridColumnDefs = this.getColumnDefs();
    this.gridData = !this.stateFiltered ? this.ruleData[idx] : this.filterData[idx];

    this.gridApi.setRowData(this.gridData);
    // this.resizeAutoSizeColumn(); // 현재 안됨 (2017-12-12)
  }

  onAcceptRules(e: any) {
    if (this.stateRefreshing) {
      e.preventDefault();
    }
    this.filterData = this.getFilterData();

    if (this.filterData.length > 0) {
      this.submitEditorModal.init(this.filterData, this.countStatement, this.categoryData);
    }
  }

  onClickRefresh(e: any) {
    if (this.stateRefreshing) {
      e.preventDefault();
    }

    this.countStatement = {
      'changed': [],
      'added': [],
      'removed': []
    };

    this.stateRefreshing = true;
    this.stateFiltered = false;
    this.getPolicyReferenceList();
    this.getRuleData();
  }

  onToggleFilterRules(e: any) {
    this.stateFiltered = !this.stateFiltered;
    this.filterData = this.getFilterData();
    this.loadItem();
  }

  private getFilterData() {
    const filterData = [];

    this.ruleData.forEach((datas, index) => {
      if (typeof datas !== 'undefined') {
        const tempFilterState = datas.filter(row => {
          return row.state.length > 0;
        });

        if (tempFilterState.length > 0) {
          filterData[index] = tempFilterState;
        }
      }
    });

    return filterData;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.getRuleData();
  }

  // 현재 제대로 동작 안하는것으로 보임 추후 수정 필요 (2017-12-07 16:00)
  private resizeAutoSizeColumn() {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  onCellValueChanged(params: any) {
    const rowNode = this.gridApi.getRowNode(params.node.id);
    const data = rowNode.data;
    const updateDatas = [];

    data.state = this.onRowChange(params) ? 'changed' : '';
    updateDatas.push(data);
    this.gridApi.updateRowData({ update: updateDatas });

    this.updateMemoryData(params);
    this.makeCategoryItems();
  }

  // 그리드 데이터 변경점 추적 메로리 갱신 메소드
  private updateMemoryData(params: any) {
    // 이전에 변경된 내용 이 있는지 확인할 필터된 Array 생성
    const checkPrevChangedMemory = this.countStatement['changed'].filter(row => {
      return row.id === params.node.id;
    });
    const changedData = {};

    // Cell 값이 변경되었는지 확인 (원본데이터와 비교해서)
    if (this.onCellChange(params)) { // 데이터 변경 발생

      if (checkPrevChangedMemory.length > 0) { // 기존에 해당 정책 id 값으로 입력된 데이터가 있으면
        checkPrevChangedMemory[0][params.colDef.field] = params.data[params.colDef.field];  // 변경된 cell 필드값의 값을 수정/추가
      } else { // 신규로 변경된 데이터면
        changedData['id'] = params.node.id; // 해당 Cell의 정책 ID값을 추가
        changedData['category_code'] = params.data.category_code; // 해당 Cell의 정책 공격유형값을 추가
        changedData['original_data'] = this.selectIDInData(params.node.id, this.originalData[this.selectedCategory]);
        changedData[params.colDef.field] = params.data[params.colDef.field];  // 변경된 cell 필드값의 값을 추가
        this.countStatement['changed'].push(changedData); // 메모리 업데이트
      }
    } else { // 데이터가 변경되지 않음

      if (checkPrevChangedMemory.length > 0) { // 기존에 해당 정책 id 값으로 입력된 데이터가 있으면
        // 입력된 cell의 필드명이 있는지 확인
        if (checkPrevChangedMemory[0].hasOwnProperty(params.colDef.field)) {
          delete checkPrevChangedMemory[0][params.colDef.field]; // 있으면 삭제 (변경되지 않았으므로)
        }
        // 객체의 필드가 ID값 및 공격유형만 남아있으면
        if (Object.keys(checkPrevChangedMemory[0]).length <= 3) {
          let targetIdx = -1;
          this.countStatement['changed'].every((row, idx) => {
            if (row.id === params.node.id) {
              targetIdx = idx;
              return false;
            } else {
              return true;
            }
          });
          if (targetIdx !== -1) {
            this.countStatement['changed'].splice(targetIdx, 1); // 카운팅에 방해되므로  삭제
          }
        }
      }
    }
  }

  private makeCategoryItems() {
    const commonCategory = [];
    const templateCategory = [];

    // const prevSelectedCategoryItem = this.selectedCategory2 || undefined;

    const info = this.categoryData;

    let selectionKey = 0;

    info.forEach((row, index, array) => {
      const key = row.categoryCode;
      if (key === this.selectedCategory.toString()) {
        selectionKey = index;
      }
      const isKeyChanged = this.countStatement['changed'].filter(row => {
        return row.category_code.toString() === key;
      });
      if (!row.isTemplateCategory) {
        const commonItem = {
          type: 'category_node',
          label: row.categoryName,
          data: {
            code: row.categoryCode,
            isChanged: isKeyChanged.length,
            isAdded: 0,
            isRemoved: 0,
          },
          icon: 'fa fa-th-large m--font-primary'
        };

        commonCategory.push(commonItem);
      } else {
        const templateItem = {
          type: 'category_node',
          label: row.categoryName,
          data: {
            code: row.categoryCode,
            isChanged: isKeyChanged.length,
            isAdded: 0,
            isRemoved: 0,
          },
          icon: 'fa fa-th-large m--font-primary'
        };

        templateCategory.push(templateItem);
      }
    });

    this.categoryCommonItems = commonCategory;
    this.categoryTemplateItems = templateCategory;

    let filterTemplate = this.getFilterTemplateData();
    filterTemplate = filterTemplate[0];
    const template_name = (filterTemplate['template_id'].toString() === '65535' ) ? 'Default' : filterTemplate['template_name'];

    this.categoryNodes = [
      {
        label: '공통정책',
        collapsedIcon: 'fa fa-bullseye m--font-dark',
        expandedIcon: 'fa fa-bullseye m--font-dark',
        expanded: true,
        selectable: false,
        children: commonCategory
      },
      {
        label: template_name,
        type: 'template_node',
        data: {
          flow: filterTemplate['flow']
        },
        collapsedIcon: 'fa fa-book m--font-info',
        expandedIcon: 'fa fa-book m--font-info',
        expanded: true,
        selectable: false,
        children: templateCategory
      }
    ];

    this.selectedCategory2 = this.categoryCommonItems[selectionKey];
  }

  private onRowChange(params: any) {
    return this.checkChangingData('row', params);
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
        // originalData = JSON.stringify(this.originalData[this.selectedCategory][Number(params.node.id)]); // row index 가 node.id 였을때
        originalData = JSON.stringify(
          this.selectIDInData(params.node.id, this.originalData[this.selectedCategory])
        ); // category+attck code가 node id 일 때
        const isAdded = params.data.isAdded ? params.data.isAdded : false;
        const isRemoved = params.data.isRemoved ? params.data.isRemoved : false;
        flag = thisData !== originalData && !isAdded && !isRemoved ? true : false;

        // 임시 초기화 값 복원
        params.data.state = prevState;
        break;
      case 'cell':
        thisData = params.data[params.colDef.field];
        // originalData = this.originalData[this.selectedCategory][Number(params.node.id)][params.colDef.field]; // row index 가 node.id 였을때
        originalData = this.selectIDInData(params.node.id, this.originalData[this.selectedCategory])
        originalData = originalData[params.colDef.field]; // category+attck code가 node id 일 때
        flag = thisData !== originalData ? true : false;
        break;
    }

    return flag;
  }

  private selectIDInData(id: string, data: any) {
    let selectedData = [];

    selectedData = data.filter((row, index) => {
      return row.id === id;
    });

    return selectedData[0];
  }

  getPolicyReferenceList() {
    this._ptEditorService.getPolicyReferenceList().subscribe(
      responses => {
        if (responses.length === 2) {
          // this.categoryData = responses[0].datas; // category_info
          // category_info 임시방편, 추후 고도화 시 해당 부분 제거 필요 (2017-12-12)
          this.categoryData = responses[0].datas.filter(data => {
            return (
              data.categoryCode === '3' ||
              data.categoryCode === '7' ||
              data.categoryCode === '1100' ||
              data.categoryCode === '1500'
            );
          });
          this.templateData = responses[1].datas; // templates
          this.makeCategoryItems();
        } else {
          console.log('error');
        }
      },
      error => {
        console.log('error', error);
      }
    );
  }

  getRuleData(type: string = '') {
    const params = {};
    if (typeof this.template_id !== 'undefined') {
      params['template_id'] = this.template_id;
    }

    this._ptEditorService.getTotalRuleList(params).subscribe(
      responses => {
        if (responses.length === 2) {
          responses.forEach(data => {
            if (typeof data.datas !== 'undefined') {
              const preRuleData = this.parseRuleData(data.datas); // 여기가 문젠데
              preRuleData.keys.forEach(key => {
                this.ruleData[key] = preRuleData.datas[key];
              });
            } else {
              console.log('error');
            }
          });

          // console.log('JSON', JSON);
          // console.log('ruleData', this.ruleData);
          // console.log('ruleData stringify', JSON.stringify(this.ruleData));
          // console.log('ruleData parse', JSON.parse(JSON.stringify(this.ruleData)));

          // this.originalData = [];
          // var originalData = [];
          // originalData = Array.from(this.ruleData);
          // this.originalData = originalData;

          // this.originalData = Object.create(this.ruleData);
          // this.originalData = Object.assign({}, this.ruleData);
          // this.originalData = Array.from(this.ruleData);
          this.originalData = JSON.parse(JSON.stringify(this.ruleData));
          this.stateRefreshing = false;
          this.loadItem();
        } else {
          console.log('error');
        }
      },
      error => {
        console.log('error', error);
      }
    );
  }

  private getFilterTemplateData() {
    const template_id = this.template_id || '65535';
    return this.templateData.filter(row => {
      return row.template_id.toString() === template_id;
    });
  }

  private makeSignatureID(categoryCode: any, attackCode: any) {
    const padL = (a,b,c) => {//string/number,length=2,char=0
      return (new Array(b||2).join(c||0)+(a||c||0)).slice(-b)
    }
    // return categoryCode.toString().padStart(5, '0') + attackCode.toString().padStart(5, '0'); // IE에서 안됨 string prototype padStart() 지원안함
    return padL(categoryCode.toString(), 5, '0') + padL(attackCode.toString(), 5, '0');
  }

  private parseRuleData(jsonData: Array<any>) {
    console.log('jsonData', jsonData);
    const tempGridData = [];
    const keys = Object.keys(jsonData);
    console.log('key object', keys);

    keys.forEach(key => {
      switch (key) {
        // 3: 프로토콜 취약점
        case '3':
          tempGridData[key] = jsonData[key].map((row, index) => {
            return {
              id: this.makeSignatureID(row.category_code, row.attack_code),
              idx: index,
              state: '',
              isAdded: false,
              isRemoved: false,
              risk_code: row.risk.code,
              risk_message: row.risk.message,
              alarm: row.alarm,
              raw_code: row.raw.code,
              raw_message: row.raw.message,
              method_code: row.method.code,
              method_message: row.method.message,
              attack_code: row.attack_code,
              attack_name: row.attack_name,
              attack_recognize_count: row.attack_recognize_count,
              attack_recognize_time: row.attack_recognize_time,
              block_recognize_count: row.block_recognize_count,
              block_time: row.block_time,
              flow_code: row.flow.code,
              flow_message: row.flow.message,
              exceptip_count: row.exceptip_count,
              threshold_study: row.threshold_study,
              category_code: row.category_code,
              category_name: row.category_name,
              mail: row.mail,
              action: row.action,
              summary_info_hacker_summary: row.summary_info.hacker_summary,
              summary_info_victim_summary: row.summary_info.victim_summary,
              summary_info_hacker_summary_v6: row.summary_info.hacker_summary_v6,
              summary_info_victim_summary_v6: row.summary_info.victim_summary_v6
            };
          });
          break;
        // 7: RateLimit(Dynamic)
        case '7':
          tempGridData[key] = jsonData[key].map((row, index) => {
            return {
              id: this.makeSignatureID(row.category_code, row.attack_code),
              idx: index,
              state: '',
              isAdded: false,
              isRemoved: false,
              risk_code: row.risk.code,
              risk_message: row.risk.message,
              alarm: row.alarm,
              raw_code: row.raw.code,
              raw_message: row.raw.message,
              method_code: row.method.code,
              method_message: row.method.message,
              attack_code: row.attack_code,
              attack_name: row.attack_name,
              attack_recognize_count: row.attack_recognize_count,
              attack_recognize_time: row.attack_recognize_time,
              block_recognize_count: row.block_recognize_count,
              block_time: row.block_time,
              flow_code: row.flow.code,
              flow_message: row.flow.message,
              exceptip_count: row.exceptip_count,
              threshold_study: row.threshold_study,
              category_code: row.category_code,
              category_name: row.category_name,
              mail: row.mail,
              action: row.action,
              summary_info_hacker_summary: row.summary_info.hacker_summary,
              summary_info_victim_summary: row.summary_info.victim_summary,
              summary_info_hacker_summary_v6: row.summary_info.hacker_summary_v6,
              summary_info_victim_summary_v6: row.summary_info.victim_summary_v6
            };
          });
          break;
        // 1100: 패턴블럭
        case '1100':
          tempGridData[key] = jsonData[key].map((row, index) => {
            return {
              id: this.makeSignatureID(row.category_code, row.attack_code),
              idx: index,
              state: '',
              isAdded: false,
              isRemoved: false,
              risk_code: row.risk.code,
              risk_message: row.risk.message,
              alarm: row.alarm,
              raw_code: row.raw.code,
              raw_message: row.raw.message,
              method_code: row.method.code,
              method_message: row.method.message,
              nocase: row.nocase,
              reqrsp_code: row.reqrsp.code,
              reqrsp_message: row.reqrsp.message,
              attack_code: row.attack_code,
              attack_name: row.attack_name,
              attack_recognize_count: row.attack_recognize_count,
              attack_recognize_time: row.attack_recognize_time,
              block_recognize_count: row.block_recognize_count,
              block_time: row.block_time,
              flow_code: row.flow.code,
              flow_message: row.flow.message,
              exceptip_count: row.exceptip_count,
              port: row.port,
              threshold_study: row.threshold_study,
              category_code: row.category_code,
              category_name: row.category_name,
              mail: row.mail,
              action: row.action,
              summary_info_hacker_summary: row.summary_info.hacker_summary,
              summary_info_victim_summary: row.summary_info.victim_summary,
              summary_info_hacker_summary_v6: row.summary_info.hacker_summary_v6,
              summary_info_victim_summary_v6: row.summary_info.victim_summary_v6,
            };
          });
          break;
        // 1500: 사용자정의 패턴블럭
        case '1500':
          tempGridData[key] = jsonData[key].map((row, index) => {
            return {
              id: this.makeSignatureID(row.category_code, row.attack_code),
              idx: index,
              state: '',
              isAdded: false,
              isRemoved: false,
              risk_code: row.risk.code,
              risk_message: row.risk.message,
              alarm: row.alarm,
              raw_code: row.raw.code,
              raw_message: row.raw.message,
              method_code: row.method.code,
              method_message: row.method.message,
              nocase: row.nocase,
              reqrsp_code: row.reqrsp.code,
              reqrsp_message: row.reqrsp.message,
              attack_code: row.attack_code,
              attack_name: row.attack_name,
              attack_recognize_count: row.attack_recognize_count,
              attack_recognize_time: row.attack_recognize_time,
              block_recognize_count: row.block_recognize_count,
              block_time: row.block_time,
              flow_code: row.flow.code,
              flow_message: row.flow.message,
              exceptip_count: row.exceptip_count,
              port: row.port,
              threshold_study: row.threshold_study,
              category_code: row.category_code,
              category_name: row.category_name,
              mail: row.mail,
              action: row.action,
              summary_info_hacker_summary: row.summary_info.hacker_summary,
              summary_info_victim_summary: row.summary_info.victim_summary,
              summary_info_hacker_summary_v6: row.summary_info.hacker_summary_v6,
              summary_info_victim_summary_v6: row.summary_info.victim_summary_v6,
              pattern_info_pattern: row.pattern_info.pattern,
              pattern_info_type: row.pattern_info.type,
              offset_info_offset: row.offset_info.offset,
              offset_info_offset_flg: row.offset_info.offset_flag
            };
          });
          break;
      }
    });

    return {
      keys: keys,
      datas: tempGridData
    };
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
