unit uProgress;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, ComCtrls, acProgressBar, ExtCtrls, StdCtrls,
  sLabel,  Vcl.Imaging.GIFImg,
  sButton, acImage, sSkinManager;

type
  TFProgressWnd = class(TForm)
    lblLoading: TsLabel;
    ImgLoading: TsImage;
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
    m_Form: TForm;
    m_bViewCancel : Boolean;

    procedure Init( AParent: TForm; bViewCancel: Boolean);
    procedure FadeIn;
    procedure FadeOut;
  public
    { Public declarations }
  end;

  procedure ProgressBegin( AParent: TForm;
                           bPossibleCancel: Boolean = False);
  procedure ProgressText( s : string );
  procedure ProgressEnd;

var
  gIsLoading : Boolean = True;
  FProgressWnd : TFProgressWnd = nil;

implementation

uses
 System.Types;

{$R *.dfm}

procedure ProgressBegin( AParent: TForm; bPossibleCancel : Boolean = False);
begin
  if not gIsLoading then
    Exit;

  FProgressWnd.Init( AParent, bPossibleCancel);
  if AParent.Showing then
    FProgressWnd.Show;
  FProgressWnd.FadeIn;
end;

procedure ProgressText( s : string );
begin
  if FProgressWnd = nil then
    Exit;

  FProgressWnd.lblLoading.Caption := s;
end;

procedure ProgressEnd;
begin
  if not gIsLoading then
    Exit;

  if FProgressWnd = nil then
    Exit;

  FProgressWnd.FadeOut;
  FProgressWnd.Hide;
end;

{ TProgressWnd }

procedure TFProgressWnd.FormCreate(Sender: TObject);
begin
  ( imgLoading.Picture.Graphic as TGIFImage ).Animate := True;
end;

procedure TFProgressWnd.Init(AParent: TForm; bViewCancel: Boolean);
var
  pt: TPoint;
begin
  m_Form := AParent;
  m_bViewCancel := bViewCancel;

  pt := m_Form.ClientToScreen( Point( 0, 0 ) );
  Self.Top := pt.Y;
  Self.Left := pt.X;

  // ��Ų ������ ����â �� �ʺ�, ���̰� ��߳�
  if AParent.HostDockSite = nil then
  begin
    Self.Height := m_Form.Height - 37;
    Self.Width := m_Form.Width - 15;
  end
  else begin
    Self.Height := m_Form.Height;
    Self.Width := m_Form.Width;
  end;
end;

procedure TFProgressWnd.FadeIn;
begin
  repeat
    Self.AlphaBlendValue := Self.AlphaBlendValue + 10;
    Sleep(10);
    Application.ProcessMessages;
  until ( Self.AlphaBlendValue >= 200 );
end;

procedure TFProgressWnd.FadeOut;
begin
  repeat
    Self.AlphaBlendValue := Self.AlphaBlendValue - 10;
    Sleep(10);
    Application.ProcessMessages;
  until ( Self.AlphaBlendValue <= 10 );
end;

end.


