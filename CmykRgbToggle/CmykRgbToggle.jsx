const _doc = app.activeDocument;
const _swatches = _doc.swatches;
const _docSwatchesValues = _swatches.itemByRange(4,(_swatches.count()-1)).colorValue;
const _docSwatches = _swatches.itemByRange(4,(_swatches.count()-1)).name;

// Color Mapping
const _colorMapping = [
    [[0,77,54,42], [178,55,54]], //Red
    [[49,0,56,15], [111,169,97]], //Light Green
    [[51,19,60,39], [82,106,73]], //Dark Green
    [[0,28,59,22], [184,139,68]] //Golden Yellow
]

function nameFormat(str) {
    const endStr = "";
    if (str.length === 3) {
        endStr = "R="+ str[0]+ " G="+ str[1]+" B="+ str[2];
    } else {
        endStr =  "C="+ str[0]+ " M="+ str[1]+" Y="+ str[2] + " K=" + str[3];
    }
    return endStr;
}

function addColor (arrIndex, arr, modeFlag) {
    const _newSwatch = _doc.colors.add();
    _newSwatch.name = nameFormat(arr[arrIndex][modeFlag ? 0 : 1]);
    _newSwatch.model = ColorModel.PROCESS;
    _newSwatch.space = modeFlag ? ColorSpace.CMYK : ColorSpace.RGB;
    _newSwatch.colorValue = arr[arrIndex][modeFlag ? 0 : 1];

    return _newSwatch;
}

function swapSwatches(oldSwatchName, newSwatchName) {
    try {
        var items = _doc.pageItems.everyItem().getElements();
        for (var m = 0; m < items.length; m++) {
            var item = items[m];
            if (item.fillColor && item.fillColor.name === oldSwatchName) {
                item.fillColor = _doc.colors.item(newSwatchName);
            }
            if (item.strokeColor && item.strokeColor.name === oldSwatchName) {
                item.strokeColor = _doc.colors.item(newSwatchName);
            }
        }
        var texts = _doc.stories.everyItem().paragraphs.everyItem().getElements();
        for (var n = 0; n < texts.length; n++) {
            var textItem = texts[n];
            if (textItem.fillColor && textItem.fillColor.name === oldSwatchName) {
                textItem.fillColor = _doc.colors.item(newSwatchName);
            }
        }
        _doc.colors.item(oldSwatchName).remove();
    } catch (e) {
        $.writeln("Error removing swatch: " + e);
    }
}

function flipColors(modeFlag) {
    try {
        for (var swapIndex = 0; swapIndex < _docSwatchesValues.length; swapIndex++) {
            for (var arrIndex = 0; arrIndex < _colorMapping.length; arrIndex++) {
                if (_docSwatchesValues[swapIndex].toString() === _colorMapping[arrIndex][modeFlag].toString()) {
                    var newSwatch = addColor(arrIndex, _colorMapping, modeFlag);
                    var swatchName1 = _docSwatches[swapIndex];
                    var swatchName2 = newSwatch.name;
                    swapSwatches(swatchName1, swatchName2);
                }
            }
        }
    } catch(e) {
        $.writeln("Error flipping colors: " + e);
    }  
}

function getMode() {
    for (var swapIndex = 0; swapIndex < _docSwatchesValues.length; swapIndex++) {
        for (e in _colorMapping) {
            if (_docSwatchesValues[swapIndex].toString() === _colorMapping[e][0].toString()) {
                alert("CMYK to RGB");
                return 0;
            }
        }
        for (e in _colorMapping) {
            if (_docSwatchesValues[swapIndex].toString() === _colorMapping[e][1].toString()) {
                alert("RGB to CMYK");
                return 1;
            }
        }
    }
    return 2;
}

// MAIN FUNCTION
const modeFlag = 1; //0 CMYK 1 RBG
const mode = getMode();

if (mode != 2) {
    flipColors(mode);
} else {
    alert("There was an error. Check color swatches palette.")
}