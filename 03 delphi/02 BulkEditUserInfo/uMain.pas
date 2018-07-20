unit uMain;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, IPEdit, ExtCtrls, AdvPanel, AdvGlassButton, AdvGroupBox, AdvCombo, AdvGlowButton, AdvEdit,
  sSpinEdit, sSpeedButton, sEdit, acImage, sLabel, sPanel, sGroupBox, System.ImageList, sButton,
  Vcl.Clipbrd, Vcl.ImgList, Vcl.StdCtrls, Vcl.Buttons,
  Generics.Collections, uProgress, uUtil, WinHTTP_XE;

type
  TFMain = class(TForm)
    WinHTTP1: TWinHTTP;
    OpenDialog1: TOpenDialog;
    lbIPListView: TListBox;
    pnMain: TPanel;
    pnList: TPanel;
    gbEditForm1: TsGroupBox;
    pnNewPWD: TsPanel;
    lbNewPWD: TsLabel;
    edtNewPWD: TsEdit;
    pnID: TsPanel;
    lbId: TsLabel;
    edtId: TsEdit;
    pnEmail: TsPanel;
    lbMail: TsLabel;
    edtMail: TsEdit;
    gbEditForm2: TsGroupBox;
    pnExpire: TsPanel;
    lbExpire: TsLabel;
    spnExpire: TsSpinEdit;
    pnEtc: TsPanel;
    lbEtc: TsLabel;
    edtEtc: TsEdit;
    pnPhone: TsPanel;
    lbPhone: TsLabel;
    Label2: TsLabel;
    Label1: TsLabel;
    edtNum1: TsEdit;
    edtNum2: TsEdit;
    edtNum3: TsEdit;
    imgPWDHint: TsImage;
    sLabel2: TsLabel;
    btnLoadFile: TsSpeedButton;
    gbSensorList: TAdvGroupBox;
    btStart: TsSpeedButton;
    imgExpireHint: TsImage;
    pnEditForm: TPanel;
    ��: TPanel;
    ilCommon: TImageList;
    pnPWD: TsPanel;
    lbPWD: TsLabel;
    edtPWD: TsEdit;
    pnNewPWD2: TsPanel;
    lbNewPWD2: TsLabel;
    edtNewPWD2: TsEdit;
    sLabel1: TsLabel;
    imgUseHint: TsImage;
    pnUseHint: TPanel;
    lbUseHint: TLabel;
    gbFailSensorList: TAdvGroupBox;
    btnSaveFile: TsSpeedButton;
    lbIPFailListView: TListBox;
    SaveDialog1: TSaveDialog;
    sSpeedButton1: TsSpeedButton;
    procedure FormCreate(Sender: TObject);
    procedure btnLoadFileClick(Sender: TObject);
    procedure FormClose(Sender: TObject; var Action: TCloseAction);
    procedure btStartClick(Sender: TObject);
    procedure edtPWDKeyPress(Sender: TObject; var Key: Char);
    procedure edtPWDMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Integer);
    procedure imgUseHintMouseEnter(Sender: TObject);
    procedure imgUseHintMouseLeave(Sender: TObject);
    function GetIPList(ipList : TStrings) : TStringList;
    procedure btnSaveFileClick(Sender: TObject);

  private
    { Private declarations }
    sFailReason : string;

    // < Key: IP:Port , Value: permmission>
    dicPermmission: TDictionary<String,Integer>;

    function doLogin: boolean;
    procedure doEdit;

    function IsValidInput: Boolean;
    function IPPortCheck(sIPPort: String): Boolean;

    function SendLoginRequest(sIPPort, sID, sPWD : String):boolean;
    function GetPermmission(sIPPort: string): Integer;
    function SendEditRequest(sIPPort, sPerm : String): boolean;
    procedure SendBulkLogoutQuery(ipList: TStringList);

  public
    { Public declarations }
    m_IPListAll : TStringList;

    m_Success : TStringList;
    m_Fail : TStringList;

    m_Tmp : TStringList;
  end;

var
  FMain: TFMain;

const
  // query
  QUERY_GET_PERMMISSION = 'https://%s/getpermissionquery';
  QUERY_LOGIN = 'https://%s/loginquery';
  QUERY_EDIT = 'https://%s/editquery'
                    + '?'
                    + 'id=%s'
                    + '&olduserid=%s'
                    + '&passwd=%s'
                    + '&oldpasswd=%s'
                    + '&ipaddr='
                    + '&expire=%s'
                    + '&num1=%s'
                    + '&num2=%s'
                    + '&num3=%s'
                    + '&perm=%s'
                    + '&mail=%s'
                    + '&etc=%s'
                    + '&jobname=config'
                    + '&auditchange=%s';
  QUERY_LOGOUT = 'https://%s/logoutquery';


  // string


  PWD_HINT = '��й�ȣ��? 9��12�ڸ��� ���ڿ��� �빮��, �ҹ���, ����, Ư������ �߿��� 3���� �̻��� �������� �Է��� �ʿ䰡 �ֽ��ϴ�.';

  EXPIRE_HINT = '��ȿ�Ⱓ�� 0~99���� �Է��� �� ������, 0�� ��ȿ�Ⱓ�� �������� �ʽ��ϴ�.';

  LID_CONFIG_EDIT_ADMIN_INFO_FORMAT =  '[������ ����][������ �ϰ� ����] ������ID : %s, ������ : %s, ��ȿ�Ⱓ : %s��';
  USE_HINT ='============== �� �� �� �� ===============' + #13#10 + #13#10

            + '1. �ϰ� ������ ���� ����Ʈ ������ �ҷ��ɴϴ�.' + #13#10

            + '- Ȯ���� : �ؽ�Ʈ ���� (.txt)' + #13#10

            + '- ���� ex) 123.123.123.123:1234' + #13#10

            + '- Enter�� ����' + #13#10

            + '- ��Ʈ �̼��� �� default �� : 4000' + #13#10  + #13#10

            + '2. �ʼ� ������ �Է��մϴ�.' + #13#10

            + '- �ű� ��й�ȣ��? ������ ����ߴ�? ���� ������ �� �����ϴ�.' + #13#10

            + '- �ΰ� ������ �Է����� ���� �� �� ������ ����˴ϴ�?.' + #13#10 + #13#10

            + '3. ������ [�α���]��ư�� Ŭ���մϴ�.' + #13#10 +#13#10

            + '4. �α��� ���� ������ Ȯ���ϰ� ���? �����ϰų� ���� �մϴ�.' + #13#10

            + '- �α��� ������ ���� ����Ʈ�� ���Ϸ� ������ �� �ֽ��ϴ�.' + #13#10 + #13#10

            + '- ���� ������ 3�� �̻� �α��� ���� �� 1�а� ������ �Ұ����մϴ�.' + #13#10

            + '5. ([���� ����] ���� ��)�α��� ���� ������ ���� ���������� �Ϸ�˴ϴ�?.' + #13#10

            + '- �������� ������ ���� ����Ʈ�� ���Ϸ� ������ �� �ֽ��ϴ�.'  + #13#10 + #13#10

            + ' ������ �߻��� �� �ֽ��ϴ�.' + #13#10 + #13#10

            + '========================================';

implementation

uses
  uAddIP, uResultList;
{$R *.dfm}



procedure TFMain.FormCreate(Sender: TObject);
begin
  // IPList �ߺ� ����
  m_IPListAll := TStringList.Create;
  m_IPListAll.Sorted := True;
  m_IPListAll.Duplicates := dupIgnore;

  m_Tmp := TStringList.Create;
  m_Success := TStringList.Create;
  m_Fail := TStringList.Create;

  // ���� Form Setting
  imgPWDHint.ShowHint := True;
  imgPWDHint.Hint := PWD_HINT;
  imgExpireHint.ShowHint := True;
  imgExpireHint.Hint := EXPIRE_HINT;

  dicPermmission := TDictionary<String,Integer>.Create;
  FProgressWnd := TFProgressWnd.Create( Self );

  edtNewPWD.MaxLength := 12;
  edtNewPWD2.MaxLength := 12;
  pnUseHint.Top := 100;
  pnUseHint.Left := 300;
  lbUseHint.Caption := USE_HINT;

  SaveDialog1.Filter := 'Text files (*.txt)|*.txt';
  SaveDialog1.DefaultExt := '.txt';
end;


procedure TFMain.FormClose(Sender: TObject; var Action: TCloseAction);
begin
  FreeAndNil(m_Tmp);

  FreeAndNil(m_IPListAll);
  FreeAndNil(m_Success);
  FreeAndNil(m_Fail);

  FreeAndNil(m_Tmp);
  FreeAndNil(FProgressWnd);

  dicPermmission.Free;
end;


procedure TFMain.btStartClick(Sender: TObject);
begin
  lbIPFailListView.Items.Clear;

  ProgressBegin(Self, False);

  ProgressText('�Է� ���� Ȯ�� ���Դϴ�.');
  if not IsValidInput then
  begin
    ProgressEnd;
    Exit;
  end;

  // ���� �� ���� ���� �������� : �� �� ���� ���� �� ������ ���� �������� �� ����
  SendBulkLogoutQuery(m_IPListAll);


  ProgressText('������ ���� �� �Դϴ�.');
  if not doLogin then
  begin
    ProgressEnd;
    if lbIPFailListView.Items.Count > 0 then gbFailSensorList.Enabled := True;
    Exit;
  end;

  ProgressText('���� ���� ���� �� �Դϴ�.');
  doEdit;
  if lbIPFailListView.Items.Count > 0 then gbFailSensorList.Enabled := True;
  ProgressEnd;
end;


function TFMain.doLogin: boolean;
var
  i : Integer;
  sPerm : string;
begin

  Result := False;
  FmResultList := TFmResultList.Create(Self);
  try
    dicPermmission.Clear;
    m_Success.Clear;
    m_Fail.Clear;
    lbIPListView.Items.Assign(m_IPListAll);

    for i := 0 to m_IpListAll.Count -1 do
    begin
      if SendLoginRequest(m_IpListAll[i], edtID.Text, edtPWD.Text) <> True then
      begin
        lbIPListView.Items[i] := m_IpListAll[i] + '|...Login Fail[' + sFailReason+ ']';
        m_Fail.Add( lbIPListView.Items[i] );
      end
      else
      begin
        case dicPermmission.Items[m_IpListAll[i]] of
          1:
          begin
            sPerm := '�Ϲݰ�����';
          end;
          2:
          begin
            sPerm := '���Ȱ�����';
          end;
          3:
          begin
            sPerm := '��ü������';
          end;
        end;

        lbIPListView.Items[i] := m_IpListAll[i] + '|...Login Success[' + sPerm + ']';
        m_Success.Add( lbIPListView.Items[i] );
      end;
    end;


    // ���? ����Ʈ
    FmResultList.lbFailListView.Items.Assign( lbIPListView.Items );
    lbIPListView.Items.Assign( m_Success );
    lbIPFailListView.Items.Assign( m_Fail );

    FmResultList.m_bEdit := False;
    if ( m_Success.Count = 0 ) then
    begin
      ShowMessage('���? ������ �α��� �����Ͽ����ϴ�.');
    end else
    begin
      if m_Fail.Count = 0 then FmResultList.btnSaveFile.Enabled := False;
      if FmResultList.ShowModal = mrOK then
      begin
        Result := True;
      end
      else begin
          SendBulkLogoutQuery( m_Success );
      end;
    end;
    FmResultList.m_bEdit := True;

  finally
    FmResultList.free;
  end;

end;



procedure TFMain.doEdit;
var
  i : Integer;
begin
  FmResultList := TFmResultList.Create(nil);
  try
    m_IPListAll.Assign( GetIPList(m_Success) );
    m_Success.Clear;

    // List ��ü(�α��ο� ������ ����Ʈ ��) Edit ���� �� ���� ���? View�� ���?
    for i := 0 to m_IPListAll.Count - 1 do
    begin
      if not SendEditRequest( m_IPListAll[i], dicPermmission.Items[m_IPListAll[i]].ToString ) then
      begin
        lbIPListView.Items[i] := m_IpListAll[i] + '|...Edit Fail[' + sFailReason+ ']';
        m_Fail.Add( lbIPListView.Items[i] );
      end
      else begin
        lbIPListView.Items[i] := m_IpListAll[i] + '|...Edit Success';
        m_Success.Add( lbIPListView.Items[i] );
      end;
    end;

    SendBulkLogoutQuery(m_IPListAll);

    // Result ���� FailListView �� assign
    FmResultList.lbFailListView.Items.Assign( lbIPListView.Items );
    lbIPListView.Items.Assign( m_Success );
    lbIPFailListView.Items.Assign( m_Fail );

    FmResultList.m_bEdit := True;

    if m_Fail.Count = 0 then FmResultList.btnSaveFile.Enabled := False;
    if FmResultList.ShowModal = mrOK then
    begin
    end;
    FmResultList.m_bEdit := False;

  finally
    FmResultList.free;
  end;
end;



function TFMain.SendLoginRequest(sIPPort, sID, sPWD : String): boolean;
var
  sRst : String;
  sIP, sPort : String;
  iPerm : integer;
  WinHTTP1: TWinHTTP;
begin
    Result := False;
    sPort := sIPPort;
    sIP := GetToken(sPort, ':');
    sFailReason := '';

    WinHTTP1 := TWinHTTP.Create(nil);
    WinHTTP1.URL := Format(QUERY_LOGIN, [sIPPort, sID, WebText(sPWD)]);
    WinHTTP1.Timeouts.ConnectTimeout := 1000 * 2;
    WinHTTP1.WaitTimeout := 1000 * 2;
    WinHTTP1.Read(True);

    sRst := WinHTTP1.ResultString;

    if (pos('fail', sRst) > 0) then
    begin
      sFailReason := '���� ����ġ';
      Exit;
    end
    else if (sRst = '') then
    begin
      sFailReason := '���� ���� ����';
      Exit;
    end;

    iPerm := GetPermmission(sIPPort);
    dicPermmission.Add(sIPPort, iPerm);
    WinHTTP1.Free;
    Result := True;
end;




function TFMain.SendEditRequest(sIPPort, sPerm : String): boolean;
var
  sAudit, sUrl, sRst, sOcx, sExpire, sPermAudit : String;
  sIP, sPort : String;
  WinHTTP1: TWinHTTP;
begin
    Result := False;


//  �Ϲݰ�����(sn_user)     : 1
//  ���Ȱ�����(sn_security) : 2
//  ��ü������(sn_manager)  : 3
    case sPerm.ToInteger of
      1:
      begin
        sOcx := 'snuser';
        sPermAudit := '�Ϲݰ�����';
      end;
      2:
      begin
        sOcx := 'snuser';
        sPermAudit := '���Ȱ�����';
      end;
      3:
      begin
        sOcx := 'config';
        sPermAudit := '��ü������';
      end;
    end;

    sAudit := Format( LID_CONFIG_EDIT_ADMIN_INFO_FORMAT
                  , [ Trim( edtId.text ), sPermAudit, spnExpire.text ] );

    sExpire := IntToStr(StrToIntDef(spnExpire.text,0)); // '00' -> �̷��� '0'���� �ٲٱ� ����
    sUrl := Format( QUERY_EDIT
                    , [ sIPPort
                      , sOcx
                      , WebText(edtId.text )       //sID
                      , WebText(edtId.text )       //sIDOld
                      , WebText(edtNewPWD.text)    //sPWD
                      , WebText(edtPWD.text)       //sPWDOld
                      , sExpire
                      , edtNum1.text               //sNum1~3
                      , edtNum2.text
                      , edtNum3.text
                      , sPerm
                      , WebText(edtMail.text)
                      , WebText(edtEtc.text)
                      , WebText(sAudit)
                      ]
                    );

    WinHTTP1 := TWinHTTP.Create(nil);
    WinHTTP1.URL := sUrl;
    WinHTTP1.Timeouts.ConnectTimeout := 1000 * 2;

    WinHTTP1.Read(True);
    sRst := WinHTTP1.ResultString;

    if (pos('exist', sRst) > 0) then
    begin
      sFailReason := '��й��? ����';
      Exit;
    end
    else if (pos('dupulicate', sRst) > 0) then
    begin
      sFailReason := 'UI ��������';
      Exit;
    end
    else if (pos('incorrect', sRst) > 0) then
    begin
      sFailReason := '��й��? ����ġ';
      Exit;
    end;

    WinHTTP1.Free;
    Result := True;
end;



function TFMain.GetPermmission(sIPPort: string): Integer;
var
  sUrl, sRst : String;
  WinHTTP1: TWinHTTP;
begin
    sUrl := Format( QUERY_GET_PERMMISSION, [ sIPPort ]);

    WinHTTP1 := TWinHTTP.Create(nil);
    WinHTTP1.URL := sUrl;
    WinHTTP1.WaitTimeout := 800;
    WinHTTP1.Read(True);
    sRst := WinHTTP1.ResultString;

    Result := Split(sRst,#16)[8].ToInteger;
    WinHTTP1.Free;
end;


procedure TFMain.SendBulkLogoutQuery(ipList: TStringList);
var
    sUrl: String;
    WinHTTP1: TWinHTTP;
    i : integer;
begin
    ProgressText('���� ���� �ʱ�ȭ �� �Դϴ�.');
    for i := 0 to ipList.Count -1 do
    begin
      sUrl := Format( QUERY_LOGOUT, [ipList[i],'logout', '1111']);

      WinHTTP1 := TWinHTTP.Create(nil);
      WinHTTP1.URL := sUrl;
      WinHTTP1.Timeouts.ConnectTimeout := 1000 * 2;
      WinHTTP1.WaitTimeout := 1000 * 2;
      WinHTTP1.Read(True);
      WinHTTP1.Free;
    end;
end;


procedure TFMain.btnSaveFileClick(Sender: TObject);
var
  fileName : String;
begin
  if SaveDialog1.Execute then
  begin
    if Sender = btnSaveFile then
    begin
      lbIPFailListView.Items.SaveToFile(SaveDialog1.FileName);
      Exit;
    end;
    GetIPList(lbIPFailListView.Items).SaveToFile(SaveDialog1.FileName);
  end;
end;


procedure TFMain.btnLoadFileClick(Sender: TObject);
var
  i : Integer;
  Str : String;
begin
  if OpenDialog1.Execute then
  begin
    m_Tmp.Clear;
    m_IPListAll.Clear;
    lbIPListView.Items.Clear;
    lbIPFailListView.Items.Clear;

    m_Tmp.LoadFromFile(OpenDialog1.FileName);

    for i := m_Tmp.Count - 1 downto 0 do
    begin
      Str := Trim(m_Tmp.Strings[i]);
      if Str = '' then begin
        m_Tmp.Delete(i);
        Continue;
      end;

      if not IPPortCheck(Str) then
      begin
        ShowMessage(Format('�߸��� ������ IP�� �ֽ��ϴ�. [line: %s]',[(i+1).ToString]));
        Exit;
      end;
    end;
    lbIPListView.Items.Assign(m_IPListAll);

    gbFailSensorList.Enabled := False;
  end;
end;



function TFMain.IPPortCheck(sIPPort: String): Boolean;
var
  sTemp, sPort, sIP : String;
  i, index, nTemp, iPort : integer;
begin
  Result := False;

  if (pos(':', sIPPort) = 0) then sIPPort := sIPPort + ':4000';
  //IP�Է� ������ �� �⺻��Ʈ 4000

  sPort := sIPPort;
  sIP := GetToken(sPort, ':');

  iPort := sPort.ToInteger();
  sIP := StringReplace(sIP, #9,' ', [rfReplaceAll]);
  sIP := GetToken(sIP, ' ');

  // �� Ŭ������ IP Check
  sTemp := sIP + '.';
  for index := 0 to 3 do
  begin
    i := Pos('.', sTemp);
    nTemp := StrToIntDef(Copy(sTemp, 1, i-1), -1);
    if (nTemp < 0) or (nTemp > 255) then
      Exit;
    Delete(sTemp, 1, i);
  end;
  if sTemp <> '' then
    Exit;

  // Port Check
  if (iPort > 65535) or (iPort < 1)  then
    Exit;

  // ���? ���? �� ���?
  m_IPListAll.Add(sIPPort);
  Result := True;
end;




function TFMain.IsValidInput: Boolean;

  function ValidPWCheck(str: String): string;
  var
    nCnt, i: Integer;
    b1, b2, b3, b4: Boolean;
    check: Boolean;
  begin
    // ��й��? ���� Ȯ��
    check := true;
    begin
      if (Length(str) < 9) or (Length(str) > 12) then
      begin
        check := false;
      end;
      if check = false then
      begin
        Result := '��й�ȣ��? 9�ڸ� �̻� 12�� �����̾��? �մϴ�.';
        exit;
      end;
    end;

    // ���� Ȯ��
    check := false;
    for i := 1 to Length(str) do
    begin
      if (Ord(str[i]) < Ord('0')) or (Ord(str[i]) > Ord('9')) then
        check := true;
    end;
    if check = false then
    begin
      Result := '��й�ȣ��? 9��12�ڸ��� ���ڿ��� �빮��, �ҹ���, ����, Ư������ �߿��� 3���� �̻��� �������� �Է��� �ʿ䰡 �ֽ��ϴ�.';
      exit;
    end;

    // ���� ���� Ȯ�� (������ ���� ���� 3�� ����? �ȵ�)
    check := True;
    nCnt := 0;
    for i := 1 to Length( str ) do
    begin
      if ( i < Length( str ) ) and ( str[i] = str[i + 1] ) then
        Inc( nCnt )
      else
        nCnt := 0;

      if ( nCnt > 1 ) then
      begin
        check := False;
        Break;
      end;
    end;

    if not Check then
    begin
      Result :='��й�ȣ��? ���ӵ� ���ڸ� �����? �� �����ϴ�. ' + #13#10 + '�ٽ� �Է����ֽñ� �ٶ��ϴ�.';
      Exit;
    end;


    b1 := IsExistChar(str, Numberic);
    b2 := IsExistChar(str, DownCaseAlphabat);
    b3 := IsExistChar(str, UpCaseAlphabat);
    b4 := IsExistChar(str, SpecialChar);
    check := (b1 and b2 and b3) or (b1 and b2 and b4) or
             (b1 and b3 and b4) or (b2 and b3 and b4);
    if not check then
    begin
      Result :='��й�ȣ��? 9��12�ڸ��� ���ڿ��� �빮��, �ҹ���, ����, Ư������ �߿��� 3���� �̻��� �������� �Է��� �ʿ䰡 �ֽ��ϴ�.';
      exit;
    end;
    Result := '';
  end;

var
  sError: String;
  nTemp: Integer;
begin
  Result := false;

  if lbIPListView.Items.Count = 0 then
  begin
    MessageDlg('�α����� ���� ����Ʈ�� �����ϴ�.', mtWarning, [mbOK], 0);
    Exit;
  end;

  if (edtID.Text = '') or (edtPWD.Text = '') then
  begin
    MessageDlg('���̵��? ��й�ȣ��? �Էµ��� �ʾҽ��ϴ�.', mtWarning, [mbOK], 0);
    Exit;
  end;

  // �ű� ��й��?, �ű� ��й��? Ȯ�� ��
  if Trim(edtNewPWD.text) <> Trim(edtNewPWD2.text) then
  begin
    MessageDlg('�ű� ��й��? Ȯ���� ��ġ���� �ʽ��ϴ�. '+ #13#10 +'�ٽ� �Է����ֽñ� �ٶ��ϴ�.', mtWarning, [mbOK], 0);
    exit;
  end;

  // ID �� ��й��? ��
  if Trim(edtId.text) = Trim(edtNewPWD2.text) then
  begin

    MessageDlg('ID�� ��й�ȣ��? �����ϴ�. '+ #13#10 +'�ٽ� �Է����ֽñ� �ٶ��ϴ�.', mtWarning, [mbOK], 0);
    exit;
  end;

  // ���� ��й�ȣ��? ��
  if Trim(edtPWD.text) = Trim(edtNewPWD.text) then
  begin
    MessageDlg('���� ��й�ȣ��? �����մϴ�. '+ #13#10 +'�ٽ� �Է����ֽñ� �ٶ��ϴ�.', mtWarning, [mbOK], 0);
    exit;
  end;

  // �� ��й��? ��ȿ�� �˻�
  sError := ValidPWCheck(Trim(edtNewPWD.text));
  if sError <> '' then
  begin
    MessageDlg(sError, mtWarning, [mbOK], 0);
    exit;
  end;

  // ��й��? ��ȿ�� �˻�
  sError := ValidPWCheck(Trim(edtNewPWD.text));
  if sError <> '' then
  begin
    MessageDlg(sError, mtWarning, [mbOK], 0);
    exit;
  end;


  // ��ȿ�Ⱓ �˻�
  nTemp := StrToIntDef(spnExpire.text, 0);
  if nTemp > 99 then spnExpire.text := '99';

  // ���� ���� �˻�
  if (Length(edtMail.text) > 0) and (not IsValidMail(Trim(edtMail.text))) then
  begin
    MessageDlg('���� ������ �ùٸ��� �ʽ��ϴ�.', mtWarning, [mbOK], 0);
    exit;
  end;

  Result := true;
end;


procedure TFMain.edtPWDKeyPress(Sender: TObject; var Key: Char);
begin
  if (Key = #22) or (Key = #3) then Key := #0;
end;

procedure TFMain.edtPWDMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Integer);
var
  sText : String;
begin
  if (Button = mbRight) then
  begin
    sText := Clipboard.AsText;
    Clipboard.Clear;
  end;
end;

function TFMain.GetIPList(IpList: TStrings): TStringList;
var
  i : integer;
  str : string;
begin
  m_Tmp.Clear;
  for i := 0 to IpList.Count-1 do
  begin
    str := IpList[i];
    m_Tmp.Add( GetToken(str,'|') );
  end;
  Result := m_Tmp;
end;

procedure TFMain.imgUseHintMouseEnter(Sender: TObject);
begin
  pnUseHint.Show;
end;

procedure TFMain.imgUseHintMouseLeave(Sender: TObject);
begin
  pnUseHint.Hide;
end;

end.
