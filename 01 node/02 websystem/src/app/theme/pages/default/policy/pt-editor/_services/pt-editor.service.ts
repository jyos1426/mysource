import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class PtEditorService {

  constructor(private http: Http) {
  }

  // 공격유형 리스트
  getCategoryList() {
    return this.http.get('/api/info/category').map((response: Response) => response.json());
  }

  // 정책 템플릿 정보 조회
  getTemplateList() {
    return this.http.get('/api/policy/ippool/templates').map((response: Response) => response.json());
  }

  // 공격유형 & 정책 템플릿 정보 조회
  getPolicyReferenceList() {
    const categoryList = this.getCategoryList();
    const templateList = this.getTemplateList();
    return forkJoin([categoryList, templateList]);
  }

  // 공통정책 패턴 리스트
  getCommonRuleList() {
    return this.http.get('/api/policy/pt-editor/common/rules').map((response: Response) => response.json());
  }

  // 템플릿 패턴 리스트 (template_id: 1-9999, 65535)
  getTemplateRuleList(params: any) {
    const getParams = {
      params: params
    };
    return this.http.get('/api/policy/pt-editor/template/rules', getParams).map((response: Response) => response.json());
  }

  // 전체 패턴 리스트
  getTotalRuleList(params: any) {
    // let urlParams = new URLSearchParams();

    // for (let param in params) {
    //   if (params.hasOwnProperty(param)) {
    //     urlParams.set(param, params[param]);
    //   }
    // }
    // template_id
    // + '?' + urlParams.toString()

    const commonRuleList = this.getCommonRuleList();
    const templateRuleList = this.getTemplateRuleList(params);
    return forkJoin([commonRuleList, templateRuleList]);
  }

}
