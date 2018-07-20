unit uResult;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.ExtCtrls, Vcl.Grids, AdvObj,
  BaseGrid, AdvGrid, Vcl.StdCtrls;

type
  TuResultForm = class(TForm)
    ListBox1: TListBox;
    AdvStringGrid1: TAdvStringGrid;
    Panel1: TPanel;
    Panel2: TPanel;
    Button2: TButton;
    btnInit: TButton;
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  uResultForm: TuResultForm;

implementation

{$R *.dfm}

end.
