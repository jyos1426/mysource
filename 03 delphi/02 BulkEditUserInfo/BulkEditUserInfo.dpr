program BulkEditUserInfo;

uses
  Forms,
  uMain in 'uMain.pas' {FMain},
  uAddIP in 'uAddIP.pas' {FmAddIP},
  uResultList in 'uResultList.pas' {FmResultList},
  uProgress in 'uProgress.pas' {FProgressWnd},
  uUtil in 'uUtil.pas' {$R *.res};

{$R *.res}

begin
  Application.Initialize;
  Application.CreateForm(TFMain, FMain);
  Application.HintHidePause := 30000;
  Application.Run;
end.
