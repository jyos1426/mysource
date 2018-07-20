unit uAddIP;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, AdvGlowButton, StdCtrls, AdvEdit, ExtCtrls, IPEdit;

type
  TFmAddIP = class(TForm)
    edtIP: TIPEdit;
    Label1: TLabel;
    Label2: TLabel;
    edtPort: TAdvEdit;
    btnAdd: TAdvGlowButton;
    procedure edtPortKeyPress(Sender: TObject; var Key: Char);
    procedure btnAddClick(Sender: TObject);
  private
    { Private declarations } 
    function IsValidIP_JK(sIP: String): Boolean; 
    function GetToken(var sSrc: string; sDelim: string): String;
  public
    { Public declarations }
  end;

var
  FmAddIP: TFmAddIP;

implementation

{$R *.dfm}

procedure TFmAddIP.edtPortKeyPress(Sender: TObject; var Key: Char);
begin
  // 숫자만 허용
  Case Ord(key) of
      3 : ;           // Ctrl + c
      22 : ;          // Ctrl + v
      24 : ;          // Ctrl + x
      26 : ;          // Ctrl + z
      48..57, 8: ;
      else
        Key := #0;
  end;
end;

function TFmAddIP.GetToken(var sSrc: string; sDelim: string): String;
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

function TFmAddIP.IsValidIP_JK(sIP: String): Boolean;
var
  i, int : Integer;
  str : array [0..3] of string;
begin
  Result := False;
  sIP := Trim(sIP);

  // 1, 2, 3
  for I := 0 to 2 do begin
    str[i] := GetToken(sIP, '.');
    if Pos(' ', str[i]) > 0 then
      Exit;
    int := StrToIntDef(str[i], -1);
    if (int < 0) or (int > 255) then
      Exit;
  end;

  // 4
  if Pos(' ', sIP) > 0 then
    Exit;
  int := StrToIntDef(sIP, -1);
  if (int < 0) or (int > 255) then
    Exit;

  Result := True;
end;

procedure TFmAddIP.btnAddClick(Sender: TObject);
var
  nPort : Integer;
begin
  ModalResult := mrNone;

  if not IsValidIP_JK(edtIP.Text) then
  begin
    MessageDlg('IP '+'정보가 올바르지 않습니다.', mtError, [mbOK], 0);
    edtIP.SetFocus;
    exit;
  end;

  nPort := StrToIntDef(edtPort.Text, -1);
  if (nPort < 0) or (nPort > 65535) then
  begin
    MessageDlg('Port '+'정보가 올바르지 않습니다.', mtError, [mbOK], 0);
    edtPort.SetFocus;
    exit;
  end;

  ModalResult := mrOk;
end;

end.
