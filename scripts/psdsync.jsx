
function openDoc(filePath){
    app.open(File(filePath));
};

function addElementAll(filePath){

    if(app.documents.length > 0){
        var docRef = app.activeDocument;
        var origName = decodeURI(docRef.name);

        var newFile = File(filePath);

        var cDoc = app.open(newFile);

        for(i=cDoc.layers.length-1;i>=0;i--){
            app.activeDocument.activeLayer = cDoc.layers[i] ;
            dupLayers(origName);
        }

        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

    }else{
        alert("Please open a document first")
    }

};

function dupLayers(aDoc) {
    function cTID(s) { return app.charIDToTypeID(s); };
    var desc153 = new ActionDescriptor();
    var ref61 = new ActionReference();
    ref61.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt') );
    desc153.putReference( cTID('null'), ref61 );
    var ref62 = new ActionReference();
    ref62.putName( cTID('Dcmn'), aDoc );
    desc153.putReference( cTID('T   '), ref62 );
    desc153.putInteger( cTID('Vrsn'), 2 );
    executeAction( cTID('Dplc'), desc153, DialogModes.NO );
};