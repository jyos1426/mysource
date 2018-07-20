unit uUtil;

interface

uses
  System.SysUtils, sEdit, sSpinEdit, System.RegularExpressions, System.Classes, Vcl.Clipbrd, Vcl.StdCtrls, Vcl.Controls, WinHttp_XE;

const
  UpCaseAlphabat: TSysCharSet = ['A' .. 'Z']; // 65 ~ 90
  DownCaseAlphabat: TSysCharSet = ['a' .. 'z']; // 97 ~ 122
  Numberic: TSysCharSet = ['0' .. '9']; // 48 ~ 57
  SpecialChar: TSysCharSet = ['!' .. '/', ':' .. '@', '[' .. '`', '{' .. '~']; // 32�� Ư������ 33 ~ 47, 58 ~ 64, 91 ~ 96, 123 ~ 126

  function WebText(sText : String): String;
  function Split(str, delimiter: string): TStringList;
  function IsExistChar(src: String; CharSet: TSysCharSet): Boolean;
  function GetToken(var sSrc: string; sDelim: string): String;
  procedure CheckMouseButtonClipboardTag(Button: TMouseButton);
  function IsValidMail(sMail: String): Boolean;


implementation


function WebText(sText: String): String;
begin
  sText := StringReplace(sText, '%','%25', [rfReplaceAll]);
  sText := StringReplace(sText, ' ','%20', [rfReplaceAll]);
  sText := StringReplace(sText, '?','%3F', [rfReplaceAll]);
  sText := StringReplace(sText, '=','%3D', [rfReplaceAll]);
  sText := StringReplace(sText, '#','%23', [rfReplaceAll]);
  sText := StringReplace(sText, '\','%5C', [rfReplaceAll]);
  sText := StringReplace(sText, '&','%26%26', [rfReplaceAll]);

  result := sText;
end;


function IsExistChar(src: String; CharSet: TSysCharSet): Boolean;
var nCnt, i: Integer;

begin
  nCnt := 0;
  for i := 1 to Length(src) do
  begin
    if CharInSet( src[i], CharSet ) then
    begin
      Inc(nCnt);
    end;
  end;
  Result := nCnt > 0;
end;

//String�� String delimiter�� ������ function
function Split(str, delimiter: string): TStringList;
var
  P, dlen, flen: integer;
begin
  Result := TStringList.Create;
  dlen := Length(delimiter);
  flen := Length(str);
  repeat
    P := Pos(delimiter, str);
    if P = 0 then
      P := flen + dlen;
    Result.Add(copy(str, 1, P - 1));
    str := copy(str, P + dlen, flen);
    flen := Length(str);
  until flen = 0;
end;




function GetToken(var sSrc: string; sDelim: string): String;
var
  nPos : Integer;
begin
  nPos := Pos(sDelim, sSrc);

  if (nPos > 0) then begin
        Dec(nPos);
    Result := copy(sSrc, 1, nPos);
    Delete(sSrc, 1, nPos + Length(sDelim));
  end else begin
    Result := sSrc;
    sSrc := '';
  end;
end;


procedure CheckMouseButtonClipboardTag(Button: TMouseButton);
var
  sText : String;
begin
  if (Button = mbRight) then
  begin
    sText := Clipboard.AsText;

    if (Pos('<', sText) > 0) or (Pos('>', sText) > 0) then
      Clipboard.Clear;
  end;
end;



function IsValidMail(sMail: String): Boolean;
  procedure Split(Delimiter: Char; Str: string; ListOfStrings: TStringList);
  begin
    ListOfStrings.Clear;
    ListOfStrings.Delimiter := Delimiter;
    ListOfStrings.StrictDelimiter := True;
    ListOfStrings.DelimitedText := Str;
  end;

  function CheckAllowedLocal(const Str: string): Boolean;
  var
    i: Integer;
  begin
    Result := False;
    for i := 1 to Length(Str) do
      if not CharInSet(Str[i], [
        'a' .. 'z', 'A' .. 'Z', '0' .. '9',
        '!', '#', '$', '%', '*', '+', '-', '/', '^', '_',
        '.'
        ]) then
        Exit;
    Result := True;
  end;

  function CheckAllowedDomain(const Str: string): Boolean;
  var
    i: Integer;
  begin
    Result := False;

    if Str = '' then
      Exit;

    if (Str[1] = '-') or (Str[length(str)] = '-') then
      Exit;

    if Length(Str) > 63 then
      Exit;

    for i := 1 to Length(Str) do
      if not CharInSet(Str[i], ['a' .. 'z', 'A' .. 'Z', '0' .. '9', '-']) then
        Exit;
    Result := True;
  end;
var
  sList: TStringList;
  i, onPos: Integer;
  Local, Domain: string;
begin
  Result := False;

  onPos := Pos('@', sMail);
  if onPos = 0 then
    Exit;

  Local := Copy(sMail, 1, onPos - 1);
  Domain := Copy(sMail, onPos + 1, Length(sMail) - onPos);

  if (Length(Local) = 0) or ((Length(Domain) < 5)) then
    Exit;

  if CheckAllowedLocal(Local) = False then
    Exit;

  sList := TStringList.Create;
  try
    Split('.', Domain, sList);
    if sList.Count < 2 then
    begin
      Result := False;
      Exit;
    end;

    for i := 0 to sList.Count - 1 do
    begin
      if CheckAllowedDomain(Trim(sList.Strings[i])) = False then
        Exit;
    end;
  finally
    sList.Free;
  end;

  Result := True;
end;


end.
