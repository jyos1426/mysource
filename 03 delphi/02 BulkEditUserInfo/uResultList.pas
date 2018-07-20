unit uResultList;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, AdvGlowButton, Vcl.StdCtrls,
  Vcl.ExtCtrls, sButton, sPanel, Vcl.Buttons, sSpeedButton;

type
  TFmResultList = class(TForm)
    lbFailListView: TListBox;
    Panel1: TPanel;
    Label1: TLabel;
    btnSaveFile: TsSpeedButton;
    sPanel2: TsPanel;
    btOk: TsButton;
    btCancel: TsButton;
    pnMain: TPanel;
    SaveDialog1: TSaveDialog;
    procedure btnSaveFileClick(Sender: TObject);
    procedure btOkClick(Sender: TObject);
    procedure FormShow(Sender: TObject);
    procedure btCancelClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
    m_bEdit : boolean;
  end;

var
  FmResultList: TFmResultList;

implementation
  uses uMain, uUtil;

{$R *.dfm}

procedure TFmResultList.FormCreate(Sender: TObject);
begin
  SaveDialog1.Filter := 'Text files (*.txt)|*.txt';
  SaveDialog1.DefaultExt := '.txt';
end;

procedure TFmResultList.FormShow(Sender: TObject);
begin
  if m_bEdit then
  begin
    Self.Caption := '센서별 계정 수정 결과';
    btOk.Caption := '닫기';
    btOk.ImageIndex := 9;
    btCancel.Visible := False;
    label1.Caption := Format('센서 계정변경 결과입니다. [성공: %s/ 실패: %s]'
                              ,[FMain.lbIPListView.Items.Count.ToString, FMain.lbIPFailListView.Items.Count.ToString]);
  end
  else begin
    Self.Caption := '센서별 로그인 결과';
    btOk.Caption := '계정 변경';
    btOk.ImageIndex := 11;
    btCancel.Visible := True;
    label1.Caption := Format( '센서 로그인 결과입니다. [성공: %s/ 실패: %s]' + #13#10 +
                      '[계정 변경] 버튼 클릭 시 로그인에 성공한 센서에 한해 ' + #13#10 +
                      '변경이 진행됩니다.'
                      ,[FMain.lbIPListView.Count.ToString, FMain.lbIPFailListView.Items.Count.ToString]);
  end;
end;

procedure TFmResultList.btCancelClick(Sender: TObject);
begin
  ModalResult := mrCancel;
end;

procedure TFmResultList.btnSaveFileClick(Sender: TObject);
var
  fileName : String;
begin
  if SaveDialog1.Execute then
  begin
    FMain.GetIPList(FMain.m_Fail).SaveToFile(SaveDialog1.FileName);
  end;
end;


procedure TFmResultList.btOkClick(Sender: TObject);
begin
  ModalResult := mrOK;
end;

end.

