
function psdCopy(filePath){

    if(documents.length==0){
        alert('Please open a document first.');
    }else{

        var docRef = app.activeDocument;
        var activeLay = docRef.activeLayer;
        var psdName = activeLay.name;
        alert(psdName);
        //var newFile = File(filePath);
        //
        //app.activeDocument = docRef;
        //
        //dupLayers(psdName);
        //
        //var newDoc = app.open(newFile);
        //
        //app.activeDocument.activeLayer  = app.activeDocument.layerSets[0];
        //dupLayers(origName);
        //
        //app.activeDocument = newDoc;
        //
        //app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

    }

};

//////////////////
//MAIN FUNCTIONS//
//////////////////

function favicon(filePath){
    var newFile = File(filePath + "/templates/faviconTemplate.psd");
    var sameOpenDocuments = 0;
    for(i=0; i < app.documents.length; i++){
        if(app.documents[i].name=="faviconTemplate.psd")
        {
            sameOpenDocuments++;
        }
    }
    if(sameOpenDocuments==0){
        app.open(newFile);
    }
    else{alert("There already is a favicon template open")}
};

function mapicon(filePath){
    var newFile = File(filePath + "/templates/mapiconTemplate.psd");

    var sameOpenDocuments = 0;
    for(i=0; i < app.documents.length; i++){
        if(app.documents[i].name=="mapiconTemplate.psd")
        {
            sameOpenDocuments++;
        }
    }
    if(sameOpenDocuments==0){
        app.open(newFile);
    }
    else{alert("There already is a map icon template open")}
};

function addElement(filePath,element){
    if(app.documents.length > 0){
        var docRef = app.activeDocument;
        var origName = decodeURI(activeDocument.name);
        var elementName = element.slice(0,4);
        if(elementName == "modu"){
            elementName = "Module";
            filePath = filePath + "/templates/" + element + ".psd";
        }else if(elementName == "cont"){
            elementName = "Content";
            filePath = filePath + "/templates/" + element + ".psd";
        }else if(elementName == "foot"){
            elementName = "Footer";
            filePath = filePath + "/templates/" + element + ".psd";
        }else if(elementName == "head"){
            elementName = "Header";
            filePath = filePath + "/templates/" + element + ".psd";
        }else if(elementName == "slid"){
            elementName = "Slider";
            filePath = filePath + "/templates/" + element + ".psd";
        }
        //var elementIndex = Number(element.slice(4));
        var newFile = File(filePath);

        var layersToRemove = new Array();
        for(i=0; i < docRef.layers.length; i++){
            if(docRef.layers[i].name==elementName)
            {
                layersToRemove.push(docRef.layers[i]);
            }
        }
        for(i=layersToRemove.length-1; 0 <=i; i--){
            layersToRemove[i].remove();
        }

        app.open(newFile);
        app.activeDocument.activeLayer  = app.activeDocument.layerSets[0];
        dupLayers(origName);
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }else{
        alert("Please open a document first")
    }
};


function newTemplate(){
    var sameOpenDocuments = 0;
    for(i=0; i < app.documents.length; i++){
        if(app.documents[i].name=="Velositey Template")
        {
            sameOpenDocuments++;
        }
    }
    if(sameOpenDocuments==0){
        createTemplate();
        var guideVerticalArray = new Array(265, 295, 360, 390, 455, 485, 550, 580, 645, 675, 740, 770, 835, 865, 930, 960, 1025, 1055, 1120, 1150, 1215, 1245, 1310, 1340, 1405, 1435);
        createVerticalGuides(guideVerticalArray);
    }
    else{alert("There already is a template open")}
};

function saveIcon(){
    var docRef = app.activeDocument;
    var activeLay = docRef.activeLayer;
    var psdName = activeLay.name;

    // vars for centerBoth
    cTID = function(s) { return app.charIDToTypeID(s); };
    sTID = function(s) { return app.stringIDToTypeID(s); };

    // get width or height
    var tempWidth = activeLay.bounds[2] - activeLay.bounds[0];
    var tempHeight = activeLay.bounds[3] - activeLay.bounds[1];

    // create newDoc
    var newDoc = app.documents.add(tempWidth,tempHeight,72,psdName, NewDocumentMode.RGB,DocumentFill.TRANSPARENT);

    app.activeDocument = docRef;

    dupLayers(psdName);

    app.activeDocument = newDoc;

    // centerBoth
    centerBoth();

    // save
    saveWebPNG();
};
///////////////////
//OTHER FUNCTIONS//
///////////////////

function centerBoth() {
    // Set
    function step1(enabled, withDialog) {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putProperty(cTID('Chnl'), sTID("selection"));
        desc1.putReference(cTID('null'), ref1);
        desc1.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('Al  '));
        executeAction(cTID('setd'), desc1, dialogMode);
    };

    // Align
    function step2(enabled, withDialog) {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
        desc1.putReference(cTID('null'), ref1);
        desc1.putEnumerated(cTID('Usng'), cTID('ADSt'), sTID("ADSCentersV"));
        executeAction(cTID('Algn'), desc1, dialogMode);
    };

    // Align
    function step3(enabled, withDialog) {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
        desc1.putReference(cTID('null'), ref1);
        desc1.putEnumerated(cTID('Usng'), cTID('ADSt'), sTID("ADSCentersH"));
        executeAction(cTID('Algn'), desc1, dialogMode);
    };

    // Set
    function step4(enabled, withDialog) {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putProperty(cTID('Chnl'), sTID("selection"));
        desc1.putReference(cTID('null'), ref1);
        desc1.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('None'));
        executeAction(cTID('setd'), desc1, dialogMode);
    };

    step1();      // Set
    step2();      // Align
    step3();      // Align
    step4();      // Set
};
function createVerticalGuides(guideVerticalArray){
    for(var i=0; i < guideVerticalArray.length; i++){
        var idMk = charIDToTypeID( "Mk  " );
        var desc3 = new ActionDescriptor();
        var idNw = charIDToTypeID( "Nw  " );
        var desc4 = new ActionDescriptor();
        var idPstn = charIDToTypeID( "Pstn" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc4.putUnitDouble( idPstn, idPxl, guideVerticalArray[i] );
        var idOrnt = charIDToTypeID( "Ornt" );
        var idOrnt = charIDToTypeID( "Ornt" );
        var idVrtc = charIDToTypeID( "Vrtc" );
        desc4.putEnumerated( idOrnt, idOrnt, idVrtc );
        var idGd = charIDToTypeID( "Gd  " );
        desc3.putObject( idNw, idGd, desc4 );
        executeAction( idMk, desc3, DialogModes.NO );
    }
};
function createTemplate(){
    var idMk = charIDToTypeID( "Mk  " );
    var desc42 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
    var desc43 = new ActionDescriptor();
    var idNm = charIDToTypeID( "Nm  " );
    desc43.putString( idNm, "\"\"Velositey Template\"\"" );
    var idMd = charIDToTypeID( "Md  " );
    var idRGBM = charIDToTypeID( "RGBM" );
    desc43.putClass( idMd, idRGBM );
    var idWdth = charIDToTypeID( "Wdth" );
    var idRlt = charIDToTypeID( "#Rlt" );
    desc43.putUnitDouble( idWdth, idRlt, 1700.000000 );
    var idHght = charIDToTypeID( "Hght" );
    var idRlt = charIDToTypeID( "#Rlt" );
    desc43.putUnitDouble( idHght, idRlt, 3000.000000 );
    var idRslt = charIDToTypeID( "Rslt" );
    var idRsl = charIDToTypeID( "#Rsl" );
    desc43.putUnitDouble( idRslt, idRsl, 72.000000 );
    var idpixelScaleFactor = stringIDToTypeID( "pixelScaleFactor" );
    desc43.putDouble( idpixelScaleFactor, 1.000000 );
    var idFl = charIDToTypeID( "Fl  " );
    var idFl = charIDToTypeID( "Fl  " );
    var idWht = charIDToTypeID( "Wht " );
    desc43.putEnumerated( idFl, idFl, idWht );
    var idDpth = charIDToTypeID( "Dpth" );
    desc43.putInteger( idDpth, 8 );
    var idprofile = stringIDToTypeID( "profile" );
    desc43.putString( idprofile, "\"\"sRGB IEC61966-2.1\"\"" );
    var idDcmn = charIDToTypeID( "Dcmn" );
    desc42.putObject( idNw, idDcmn, desc43 );
    executeAction( idMk, desc42, DialogModes.NO );
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