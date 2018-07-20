import { Injectable } from '@angular/core';

@Injectable()
export class AgCellRenderer {
  constructor() {}

  rendererRisk(params: any) {
    let res = '';
    const risk = Number(params.value);

    switch (risk) {
      case 0:
        res = '<span class="m-badge m-badge--info"><b>L</b></span> 낮음';
        break;
      case 1:
        res = '<span class="m-badge m-badge--warning"><b>M</b></span> 보통';
        break;
      case 2:
        res = '<span class="m-badge m-badge--danger"><b>H</b></span> 높음';
        break;
    }

    // const caret = '<span class="pull-right"><i class="fa fa-caret-down"></i></span>';
    // return res + caret;
    return res;
  }

  rendererAction(params: any) {
    let res = '';
    const action = params.value.toString();

    switch (action) {
      case 'pass':
        res = '<span class="m-badge m-badge--default m-badge--rounded"><b>미탐</b></span>';
        break;
      case 'detect':
        res = '<span class="m-badge m-badge--primary m-badge--rounded"><b>탐지</b></span>';
        break;
      case 'block':
        res = '<span class="m-badge m-badge--danger m-badge--rounded"><b>차단</b></span>';
        break;
    }
    // const caret = '<span class="pull-right"><i class="fa fa-caret-down"></i></span>';
    // return res + caret;
    return res;
  }

  rendererBoolean(params: any) {
    let res = '';
    const flag = params.value.toString();

    if (flag === '1') {
      res = '<span class="m--font-primary"><i class="fa fa-check-square-o"></i></span>';
    } else {
      res = '<span class="m--font-default"><i class="fa fa-square-o"></i></span>';
    }

    return res;
  }

  rendererMethod(params: any) {
    let res = '';
    const method = Number(params.value);

    // { value: 1, text: 'SN_SRC_IP' },
    // { value: 2, text: 'SN_DST_IP' },
    // { value: 8, text: 'SN_AND_IP' },
    // { value: 256, text: 'SN_SRC_SERV' },
    // { value: 512, text: 'SN_DST_SERV' },

    switch (method) {
      case 1:
        res = 'SN_SRC_IP';
        break;
      case 2:
        res = 'SN_DST_IP';
        break;
      case 8:
        res = 'SN_AND_IP';
        break;
      case 256:
        res = 'SN_SRC_SERV';
        break;
      case 512:
        res = 'SN_DST_SERV';
        break;
      case 16385:
        res = 'SN_RATELIMIT_PPS';
    }

    // const caret = '<span class="pull-right"><i class="fa fa-caret-down"></i></span>';
    // return res + caret;
    return res;
  }

  rendererFlow(params: any) {
    let res = '';
    const flow = params.value.toString();

    switch (flow) {
      case 'all':
        res = '<span class="m-badge m-badge--primary m-badge--wide m-badge--dot"></span> 전체';
        break;
      case 'inbound':
        res = '<span class="m-badge m-badge--warning m-badge--wide m-badge--dot"></span> InBound';
        break;
      case 'outbound':
        res = '<span class="m-badge m-badge--success m-badge--wide m-badge--dot"></span> OutBound';
        break;
    }

    return res;
  }

  rendererState(params: any) {
    let res = '';
    const state = params.value.toString();

    switch (state) {
      case 'changed':
        res = '<span class="m--font-light" title="수정됨" alt="changed"><i class="fa fa-pencil"></i></span>';
        break;
      case 'added':
        res = '<span class="m--font-light" title="추가됨" alt="added"><i class="fa fa-plus"></i></span>';
        break;
      case 'removed':
        res = '<span class="m--font-light" title="삭제됨" alt="removed"><i class="fa fa-minus"></i></span>';
        break;
    }

    return res;
  }
}
