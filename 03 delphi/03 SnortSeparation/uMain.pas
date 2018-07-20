unit uMain;

interface
uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, ImgList, ImageList, ExtCtrls, StdCtrls, Buttons, ShellApi, FolderDialog,
  uUtil, uSnortChecker;

const
  PB_MAX_LENGTH = 10240;
  PB_MIN_LENGTH = 10240;

type
  TFMain = class(TForm)
    pnMain: TPanel;
    ilCommon: TImageList;
    OpenDialog1: TOpenDialog;
    edtUnNamed: TEdit;
    Label2: TLabel;
    edtOpenPath: TEdit;
    Button1: TButton;
    Button2: TButton;
    Panel1: TPanel;
    btnInit: TButton;
    Label6: TLabel;
    FolderDialog1: TFolderDialog;
    edtSavePath: TEdit;
    btnSavePath: TButton;
    chkSavePath: TCheckBox;
    Label1: TLabel;

    procedure FormCreate(Sender: TObject);
    procedure chkSavePathClick(Sender: TObject);
    procedure btnSavePathClick(Sender: TObject);
    procedure btnLoadFileClick(Sender: TObject);
    procedure Button1Click(Sender: TObject);
    procedure btnInitClick(Sender: TObject);

    procedure ParseSnort(sSnortRule: String);

    function CheckHasOptionSnort(sSnortRule : String): boolean;
    function IsTypeBin(sPayload : String): boolean;
    function GetCase(sPattern : String): String;

  private
    { Private declarations }
  public
    { Public declarations }
    m_TmpList : TStringList;
    m_SnortList : TStringList;
    m_PBList : TStringList;

    // Snort 규칙
    sProtocol, sDPORT, sMsg, sContent : String;
    iUnNamedCnt : Integer;
  end;


var
  FMain: TFMain;

implementation
uses
  AnsiStrings;

{$R *.dfm}

procedure TFMain.btnInitClick(Sender: TObject);
begin
  edtUnNamed.Text := '0';
  edtOpenPath.Text := '';

  chkSavePath.Checked := False;
  edtSavePath.Text := '';
//  edtSavePath.Enabled := False;
  btnSavePath.Enabled := False;

  edtSavePath.Text := GetCurrentDir;

end;

procedure TFMain.btnLoadFileClick(Sender: TObject);
var
  i : Integer;
  sError : String;
  sTest, sType, sCase, sErrorRules: String;
begin

  if String(edtOpenPath.Text).Length = 0 then
  begin
    ShowMessage('분리할  파일을 선택해 주세요.');
    Exit;
  end;

  // init
  m_SnortList := TStringList.Create;
  m_PBList := TStringList.Create;
  m_TmpList := TStringList.Create;
  m_TmpList.LoadFromFile(OpenDialog1.FileName);

  iUnnamedCnt := strToInt(edtUnNamed.Text);
  m_PBList.Add('name' +#9+ 'pattern' +#9+ 'type' +#9+ 'case-sensitive' +#9+ 'protocol' +#9+ 'port');

  try
    // 0. 올바른 SnortRule 체크
    for i := 0 to m_TmpList.Count - 1 do
    begin
      if not CheckSnortRule(m_TmpList[i], sError) then
        sErrorRules := sErrorRules + ', '+ IntToStr(i+1);
      if sErrorRules.Length > 100 then
      begin
        delete(sErrorRules,1,2);
        ShowMessage(Format('[%s 번째 등]'+#13#10+'상당 수의 Snort 룰 정보가 올바르지 않습니다.',[sErrorRules]));
        Exit;
      end;
    end;

    if sErrorRules.Length <> 0 then
    begin
      delete(sErrorRules,1,2);
      ShowMessage(Format('[%s]번째 Snort 룰 정보가 올바르지 않습니다.',[sErrorRules]));
      Exit;
    end;


    for i := 0 to m_TmpList.Count - 1 do
    begin
      // 1. content, msg, nocase, sid 외에 다른 조건이 있으면 snort
      // 2. content 가 없으면 snort
      // 3. content가 2개 이상이면 snort
      if CheckHasOptionSnort(m_TmpList[i])
        or ( ( Pos('content :',m_TmpList[i]) = 0) and (Pos('content:',m_TmpList[i]) = 0 ))
        or (CountPos('content :', m_TmpList[i]) >= 2)
        or (CountPos('content:' , m_TmpList[i]) >= 2) then
      begin
        m_SnortList.Add(m_TmpList[i]);
      end
      else
      begin
        ParseSnort(m_TmpList[i]);

        // 4. content에 부분으로 hex처리(||)  되어있을 때 snort
        if ( Pos('|',sContent) > 0) and ( CountPos('|',sContent) <> CountPos('\|',sContent) )  then
          begin
          if not (( CountPos('|',sContent) = 2 ) and (sContent.Chars[0] = '|') and (sContent.Chars[ sContent.Length -1 ] = '|')) then
          begin
            m_SnortList.Add(m_TmpList[i]);
            Continue;
          end;
        end;

        // 5. port가 any이면 snort
        // 6. content 길이 유효성 맞지않으면 snort
        // 7. port 에 옵션 처리시 snort
        if ( Pos('any',sDPort) > 0) or ( sContent.Length > 127) or (sContent.Length < 3 )
            or (Pos(':',sDPort) > 0) or (Pos('!',sDPort) > 0)then
        begin
          m_SnortList.Add(m_TmpList[i]);
          Continue;
        end;

        sContent := removeEscape(sContent);
        if IsTypeBin(sContent) then
          sType := 'bin'
        else
          sType := 'txt';
        sCase := getCase(m_TmpList[i]);

        m_PBList.Add(sMsg +#9+ sContent +#9+ sType +#9+ sCase +#9+ sProtocol +#9+ sDPort);

      end;

    end;
    // for loop end;

    // 분리 완료
    m_SnortList.SaveToFile(edtSavePath.Text+'/[Separated]Snort.txt');
    m_PBList.SaveToFile(edtSavePath.Text+'/[Separated]PatternBlock.txt');

    showMessage('분리가 완료 되었습니다.' +#13#10+ Format('Snort : %s개/ 패턴블럭 : %s개',[ IntToStr(m_SnortList.Count), IntToStr(m_PBList.Count - 1)]) );
    ShellExecute(Application.Handle,
                 PChar('explore'),
                 PChar(edtSavePath.Text),
                 nil,
                 nil,
                 SW_SHOWNORMAL);

  finally
    FreeAndNil(m_SnortList);
    FreeAndNil(m_PBList);
    FreeAndNil(m_TmpList);
  end;

end;

function TFMain.IsTypeBin(sPayload : String): boolean;
var
  sTemps : TStringList;
  i: Integer;
begin
  Result := True;
  if Pos('%', sPayload) = 0 then
  begin
    Result := False;
    Exit;
  end;

  sTemps := TstringList.Create;
  sTemps := Split(sPayload, '%');

  for i := 1 to sTemps.Count -1 do
  begin
    if (sTemps[i].Length <> 2 ) or ( not IsHex(sTemps[i])) then
      Result := False;
  end;

  FreeAndNil(sTemps);
end;


function TFMain.CheckHasOptionSnort(sSnortRule: String): boolean;
var
sTemps : TStringList;
nStartPos, nEndPos, i : Integer;
begin
  //옵션 없음
  Result := False;

  sTemps := TstringList.Create;

  nStartPos := Pos('(',sSnortRule);
  nEndPos := Pos(';)',sSnortRule);

  if nStartPos = 0 then
  begin
    FreeAndNil(sTemps);
    Exit;
  end;

  Delete(sSnortRule, 1, nStartPos);
  Delete(sSnortRule, nEndPos - nStartPos, 2);

  sTemps := Split(sSnortRule, ';');

  for i := 0 to sTemps.Count -1 do
  begin
    // msg, content, nocase 외 다른 옵션이 있거나, content에 !옵션이 있는 경우.
    if not ((  Pos('msg',sTemps[i]) <> 0 ) or ( Pos('content',sTemps[i]) <> 0 ) or ( Pos('nocase',sTemps[i]) <> 0 ) or ( Pos('sid',sTemps[i]) <> 0 ))
      or ( Pos('content:!',sTemps[i]) <> 0 ) or ( Pos('content :!',sTemps[i]) <> 0 ) then
    begin
      Result := True;
      FreeAndNil(sTemps);
      Exit;
    end;
  end;

  FreeAndNil(sTemps);

end;


procedure TFMain.ParseSnort(sSnortRule: String);
var
sTemp : String;
sAction, sSIP, sSPORT, sDIP : String;
begin

  // init
  sAction := '';
  sProtocol := '';
  sSIP := '';
  sSPORT := '';
  sDIP := '';
  sDPORT := '';
  sMsg := '';
  sContent := '';

  // Header Parse
  // Action
  sSnortRule := Trim(sSnortRule);
  sAction := GetToken(sSnortRule, ' ');
  // protocol
  sSnortRule := Trim(sSnortRule);
  sProtocol := GetToken(sSnortRule, ' ');
  // SIP
  sSnortRule := Trim(sSnortRule);
  sSIP := GetToken(sSnortRule, ' ');
  // SPORT
  sSnortRule := Trim(sSnortRule);
  sSPORT := GetToken(sSnortRule, ' ');

  // Direction
  sSnortRule := Trim(sSnortRule);
  sTemp := GetToken(sSnortRule, ' ');
  // DIP
  sSnortRule := Trim(sSnortRule);
  sDIP := GetToken(sSnortRule, ' ');
  // DPort
  sSnortRule := Trim(sSnortRule);
  sDPORT := GetToken(sSnortRule, ' ');
  if sDPORT = 'any' then
    sDPort := '80';

  // Msg Parse
  if( Pos('msg:',sSnortRule) > 0 ) or ( Pos('msg :',sSnortRule) > 0 ) then
    sMsg := parseMsg(sSnortRule)
  else
  begin
    sMsg := 'Unnamed Pattern ' + IntToStr(iUnnamedCnt);
    iUnnamedCnt := iUnnamedCnt + 1;
  end;

  // Content Parse
  sContent := parseContent(sSnortRule);
end;


function TFMain.getCase(sPattern : String): String;
begin
  Result := 'y';
  if Pos('nocase;', sPattern) > 0 then
  begin
    Result := 'n';
    Exit;
  end;
end;


procedure TFMain.FormCreate(Sender: TObject);
begin
  btnInit.Click;
end;

procedure TFMain.Button1Click(Sender: TObject);
begin
  try
    if OpenDialog1.Execute then
      edtOpenPath.Text := String(OpenDialog1.FileName);

  finally
  end;
end;

procedure TFMain.chkSavePathClick(Sender: TObject);
begin
  btnSavePath.Enabled := chkSavePath.Checked;
  edtSavePath.Enabled := chkSavePath.Checked;

  if chkSavePath.Checked then
//    edtSavePath.Text := ''
  else
    edtSavePath.Text := GetCurrentDir;

end;

procedure TFMain.btnSavePathClick(Sender: TObject);
begin
  try
    if FolderDialog1.Execute then
      edtSavePath.Text := String(FolderDialog1.Directory);
  finally
  end;
end;


end.
