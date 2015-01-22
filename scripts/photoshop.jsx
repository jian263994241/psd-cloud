var _localFilePath = '<%=filePath%>';
var _localFileName = '<%=fileName%>';
// enable double clicking from the Macintosh Finder or the Windows Explorer
//#target photoshop
// in case we double clicked the file
app.bringToFront();

var startRulerUnits = app.preferences.rulerUnits;
var startTypeUnits = app.preferences.typeUnits;
var startDisplayDialogs = app.displayDialogs;

app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;
app.displayDialogs = DialogModes.NO;



var oDoc = app.open(File(_localFilePath),OpenDocumentType.PHOTOSHOP,true);

var docName = _localFileName.split('.')[0]
    ,docHeight = Number(oDoc.height)
    ,docWidth = Number(oDoc.width);

//oDoc.flatten();
oDoc.selection.selectAll();
oDoc.selection.copy();

oDoc.close(SaveOptions.DONOTSAVECHANGES);

if (app.documents.length == 0)
{
    var srcDoc = app.documents.add(docWidth, docHeight, 72, docName, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
}else{
    var srcDoc = app.activeDocument;
}

var topLeftH = Math.floor(Math.random() * 2);
var topLeftV = Math.floor(Math.random() * 2);
var docH = srcDoc.width.value / 2;
var docV = srcDoc.height.value / 2;

var selRegion = [
    [topLeftH * docH, topLeftV * docV],
    [topLeftH * docH + docH, topLeftV * docV],
    [topLeftH * docH + docH, topLeftV * docV + docV],
    [topLeftH * docH, topLeftV * docV + docV],
    [topLeftH * docH, topLeftV * docV]
];

srcDoc.selection.select(selRegion);
srcDoc.paste();
srcDoc.activeLayer.name = docName;

// Reset the application preferences
app.preferences.rulerUnits = startRulerUnits;
app.preferences.typeUnits = startTypeUnits;
app.displayDialogs = startDisplayDialogs;





