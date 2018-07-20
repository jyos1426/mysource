unit uSnortChecker;

interface
uses
  classes, windows;

const
  ERROR_SIZE = 10240;
  RULE_SIZE  = 10240;
  DLL_NAME   = 'rulecheck.dll';

function InitSnortRule(var sError : String) : Boolean;
function CheckSnortRule(const sRule : String; var sError : String) : Boolean;
function CheckSnortRuleNoInit(const sRule : String; var sError : String) : Boolean;
function ParseMsg(sRule : String) : String;
function ParseContent(sRule: String): String;

procedure FreeSnortRule;

implementation
uses
  AnsiStrings, SysUtils, uUtil;
var
  initSnortRuleChecker : function (errbuf: PChar; errbuf_size, langcode : Integer) : integer; cdecl;// stdcall;
  checkRule : function (srule: PAnsiChar; srule_size : Integer; errbuf: PAnsiChar; errbuf_size : Integer) : integer; cdecl;// stdcall;
  freeSnortRuleChecker : procedure; cdecl;// stdcall;
  nDllHandle : HWND;

function initFunction : boolean;
var
  DllFunc: TFarProc;
begin
  result := false;
  if nDllHandle < 32 then exit;

  //�ʱ�ȭ �Լ� ����
  DllFunc := GetProcAddress(nDllHandle, 'initSnortRuleChecker');
  if DllFunc = nil then exit;
  @initSnortRuleChecker := DllFunc;

  //üũ �Լ� ����
  DllFunc := GetProcAddress(nDllHandle, 'checkSnortRule');
  if DllFunc = nil then exit;
  @checkRule := DllFunc;

  //���� �Լ� ����
  DllFunc := GetProcAddress(nDllHandle, 'freeSnortRuleChecker');
  if DllFunc = nil then exit;
  @freeSnortRuleChecker := DllFunc;

  result := true;
end;

function InitSnortRule(var sError : String) : Boolean;
var
  cError: array[0..ERROR_SIZE-1] of Char;
  nErrSize : integer;
begin
  result := false;

  if nDllHandle < 32 then
  begin
    sError := 'dll Load Error!!';
    exit;
  end;

  FillChar(cError, ERROR_SIZE, 0);
  nErrSize := SizeOf(cError);

  if initSnortRuleChecker(cError, nErrSize, 0) <> 0 then
  begin
    sError := '[Error] InitSnortRule : ' + SysUtils.StrPas(cError);
    exit;
  end;

  result := True;
end;

function CheckSnortRule(const sRule : String; var sError : String) : Boolean;
var
  cError: array[0..ERROR_SIZE-1] of AnsiChar;
  cRule : array[0..RULE_SIZE-1] of AnsiChar;
begin
  result := false;

  FillChar(cError, ERROR_SIZE, 0);
  FillChar(cRule, RULE_SIZE, 0);

  AnsiStrings.StrPCopy(cRule, AnsiString(sRule));

  if not InitSnortRule(sError) then exit;

  result := CheckSnortRuleNoInit(sRule, sError);

  FreeSnortRule;
end;

function CheckSnortRuleNoInit(const sRule : String; var sError : String) : Boolean;
var
  cError: array[0..ERROR_SIZE-1] of AnsiChar;
  cRule : array[0..RULE_SIZE-1] of AnsiChar;
  nRuleSize, nErrSize : integer;
begin
  result := false;

  if nDllHandle < 32 then
  begin
    sError := 'dll Load Error!!';
    exit;
  end;

  FillChar(cError, ERROR_SIZE, 0);
  FillChar(cRule, RULE_SIZE, 0);
  nErrSize := SizeOf(cError);

  AnsiStrings.StrPCopy(cRule, AnsiString(sRule));
  nRuleSize := length(sRule);

  result := checkRule(cRule, nRuleSize, cError, nErrSize) = 0;

  if not result then sError := String(AnsiStrings.StrPas(cError));
end;


procedure FreeSnortRule;
begin 
  freeSnortRuleChecker;
end;

function ParseSID(sRule: String): int64;
var
  nPos, nPosEnd : integer;
  sSID : String;
begin
  Result := -1;
  nPos := Pos('sid:', sRule);
  if (nPos <= 2) then exit;
  if nPos + 3 > length(sRule) then exit;
  if (sRule[nPos-1] <> ' ') and (sRule[nPos-1] <> '(') and (sRule[nPos-1] <> ';') then exit;
  if (sRule[nPos+3] <> ':') and (sRule[nPos+3] <> '=') then exit;

  nPos := nPos+4;
  nPosEnd := PosEx(';', sRule, nPos);

  if nPosEnd = 0 then
    nPosEnd := PosEx(')', sRule, nPos);
  if nPosEnd = 0 then exit;

  sSID := Copy(sRule, nPos, nPosEnd-nPos);
  if (sSID[1] = '"') and (sSID[length(sSID)] = '"') then
  begin
    sSID := copy(sSID, 2, length(sSID) - 2);
  end;

  result := StrToInt64Def(sSID, -1);
  if result >= 60000 then
    result := -1;
end;

function ParseMsg(sRule: String): String;
var
  nPos, nPos1, nPos2, nPosEnd : integer;
  sTemp : String;
begin
  nPos := 0;
  nPos1 := Pos('msg:', sRule);
  nPos2 := Pos('msg :', sRule);

  if nPos1 = nPos2 then
  begin
    Result := '';
    exit;
  end;

  if ( nPos1 > nPos2) then
    nPos := nPos1 + Length('msg:')
  else
    nPos := nPos2 + Length('msg :');

  nPosEnd := PosEx('";', sRule, nPos);
  if nPosEnd = 0 then
  begin
    nPosEnd := PosEx('")', sRule, nPos);
    if nPosEnd = 0 then
    begin
      Result := '';
      exit;
    end;
  end;

  sTemp := Trim( Copy(sRule, nPos, nPosEnd-nPos) );
  delete(sTemp,1,1);
  Result := sTemp;
end;

function ParseContent(sRule: String): String;
  var
  nPos, nPos1, nPos2, nPosEnd : integer;
  sTemp : String;
begin
  nPos := 0;
  nPos1 := Pos('content:', sRule);
  nPos2 := Pos('content :', sRule);

  if nPos1 = nPos2 then
  begin
    Result := '';
    exit;
  end;

  if ( nPos1 > nPos2) then
    nPos := nPos1 + Length('content:')
  else
    nPos := nPos2 + Length('content :');

  nPosEnd := PosEx('";', sRule, nPos);
  if nPosEnd = 0 then
  begin
    nPosEnd := PosEx('")', sRule, nPos);
    if nPosEnd = 0 then
    begin
      Result := '';
      exit;
    end;
  end;

  sTemp := Trim( Copy(sRule, nPos, nPosEnd-nPos) );
  delete(sTemp,1,1);

  Result := sTemp;
end;


function ParseAction(sRule: String): String;
var
  sTemp : String;
begin
  sTemp := sRule;
  result := Trim(GetToken(sTemp, ' '));
end;

initialization
  nDllHandle := LoadLibrary(DLL_NAME);
  initFunction;
finalization
  if nDllHandle >= 32 then
    FreeLibrary(nDllHandle);

end.
