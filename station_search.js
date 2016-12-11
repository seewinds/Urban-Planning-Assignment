// Global var
var LngArray = [];
var LatArray = [];
var trans = [];        // trans id
var stopName = [];     // stop name
var transName = [];    // line name
var count = 0;                  // possible trans count
var countStop = 0;              // stop count
var countLine = 0;              // line count
const total = 999;              // total id
var safety = 0;                 // Avoid double click.

function transInit() {
    // initiate the possible line number
    for (var i=0; i<=total; i++) {
        trans[i] = String(i + 1);
        trans[i] += String("路");
    }
    trans[1000] = "3路内环";
    trans[1001] = "6路/6W路";
    trans[1002] = "D1路";
    trans[1003] = "D2路";
    trans[1004] = "D3路";
    trans[1005] = "D4路";
    trans[1006] = "D5路";
    trans[1007] = "D7路";
    trans[1008] = "D8路";
    trans[1009] = "D9路";
    trans[1010] = "D10路";
    trans[1011] = "D11路";
    trans[1012] = "D12路";
    trans[1013] = "D13路";
    trans[1014] = "D14路";
    trans[1015] = "D15路";
    trans[1016] = "D16路";
    trans[1017] = "D17路";
    trans[1018] = "D18路";
    trans[1019] = "D20路";
    trans[1020] = "29路/29W路";
    trans[1021] = "36路/36W路";
}

function lineSearch(line) {
    if (safety!=1) return;
    var linesearch = new AMap.LineSearch({
        pageIndex: 1,
        city: '025',
        pageSize: 1,
        extensions: 'all'
    });
    linesearch.search(line, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            lineSearch_CallBack(result);
        } else {
            checkRes();
        }
    });
}

function lineSearch_CallBack(data) {
    var lineArr = data.lineInfo;
    var lineNum = data.lineInfo.length;
    transName[countLine] = data.lineInfo[0].name;
    if (lineNum != 0) {
        var stops = lineArr[0].via_stops;
        var stopNum = stops.length;
        for (var i=0; i<stopNum; i++) {
            LngArray[countStop] = String(stops[i].location.lng);
            LatArray[countStop] = String(stops[i].location.lat);
            stopName[countStop] = String(stops[i].name);
            printRes();
        }
    }
    checkRes();
}

function printRes() {
    document.getElementById("show_status").innerHTML += "<p> No." + countStop + ", "+ transName[countLine] + ", " + stopName[countStop] + ", " + LngArray[countStop] + ", " + LatArray[countStop] + " </p>";
    countStop++;
}

function checkRes() {
    if (count <= total) {
        nextCount();
    } else {
        document.getElementById("show_status").innerHTML += "Congratulations!!! COMPLETE!!!";
        saveResult();
    }
}

function nextCount() {
    countLine++;
    lineSearch(trans[++count]);
}

function saveResult() {
    var textRes = String("");
    var i = 0;
    while (i < countStop) {
        textRes += stopName[i] + "," + LngArray[i] + "," + LatArray[i] + "\n";
        i++;
    }
    var textFileAsBlob = new Blob([textRes], {
        type: 'text/plain'
    });
    var fileName = "Data";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
    document.getElementById('start_btn').innerHTML="好了好了";
    safety = 3;
}

function doit() {
    if (safety==0) {
        safety++;
        transInit();
        document.getElementById('start_btn').innerHTML="停下来喂";
        lineSearch(trans[0]);
    } else if (safety==1) {
        if (confirm("你要停下来么？")) {
            safety++;
            document.getElementById('start_btn').innerHTML="刷新刷新";
        }
    } else if (safety==2) {
        if (confirm("要重来咯~")) {
            location.reload();
        }
    } else {
        if (confirm("再来一次！")) {
            location.reload();
        }
    }
}