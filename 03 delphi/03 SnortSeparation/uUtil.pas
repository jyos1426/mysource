unit uUtil;

interface

uses
  System.SysUtils,  System.Classes;

  function Split(str, delimiter: string): TStringList;
  function GetToken(var sSrc: string; sDelim: string): String;
  function CountPos(const subtext: string; Text: string): Integer;
  function IsHex(s: string): boolean;
  function removeEscape(var sText: String): String;


implementation


function removeEscape(var sText: String): String;
var
i : Integer;
a : char;
begin
  sText := StringReplace(sText, '\;',';', [rfReplaceAll]);
  sText := StringReplace(sText, '\"','"', [rfReplaceAll]);
  sText := StringReplace(sText, '\\','\', [rfReplaceAll]);

  // |00 11 22 33| -> %00%11%22%33
  if (( CountPos('|',sText) = 2 ) and (sText.Chars[0] = '|') and (sText.Chars[ sText.Length-1 ] = '|')) then
  begin
    delete(sText,sText.Length,1);
    delete(sText,1,1);
    sText := StringReplace(sText, ' ','', [rfReplaceAll]);

    for i := sText.Length-1 downto 0 do
    begin
      if (i+1) mod 2 = 0 then
      begin
        a := sText.Chars[i];
        Insert('%',sText,i);
      end;
    end;
  end
  else
  // simple string
  begin
    sText := StringReplace(sText, '\|','|', [rfReplaceAll]);
  end;
  result := sText;
end;

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

function CountPos(const subtext: string; Text: string): Integer;
begin
  Result := (Length(Text) - Length(StringReplace(Text, subtext, '', [rfReplaceAll]))) div Length(subtext);
end;

function IsHex(s: string): boolean;
var
  i: integer;
begin
  Result := True;
  for i := 1 to length(s) do
    if not (char(s[i]) in ['0'..'9']) and not (char(s[i]) in ['A'..'F']) then
    begin
      Result := False;
      exit;
    end;
end;


end.
