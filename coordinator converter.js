

//////////////////////////////////////
////////////// --------- /////////////
////////////// Converter /////////////
////////////// --------- /////////////
//////////////////////////////////////


// Global vars
var safety = 0;
var LngArray = [];
var LatArray = [];
var result = [];
var count = 0;
const total = 10;

function addressInit() {
    LngArray[0]=118.809637;
    LngArray[1]=118.809637;
    LngArray[2]=118.807702;
    LngArray[3]=118.80232;
    LngArray[4]=118.807702;
    LngArray[5]=118.812624;
    LngArray[6]=118.812429;
    LngArray[7]=118.812073;
    LngArray[8]=118.812624;
    LngArray[9]=118.812073;

    LatArray[0]=32.809637;
    LatArray[1]=32.809637;
    LatArray[2]=32.807702;
    LatArray[3]=32.80232;
    LatArray[4]=32.807702;
    LatArray[5]=32.812624;
    LatArray[6]=32.812429;
    LatArray[7]=32.812073;
    LatArray[8]=32.812624;
    LatArray[9]=32.812073;
}

function saveResult() {
    var textRes = String("");
    var i = 0;
    while (i < total) {
        textRes += LngArray[i] + ", " + LatArray[i] + "\n";
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

function runTrans() {
    if (safety!=1) return;
    if (out_of_china(LngArray[count], LatArray[count])) {
        result[count] = LngArray[count] + ", " + LatArray[count]
    } else {
        var alng = gcj02towgs84_lng(LngArray[count], LatArray[count]);
        var alat = gcj02towgs84_lat(LngArray[count], LatArray[count]);
        result[count] = alng + ", " + alat;
    }

    showRes(count);
    count++;
    if (count<total) runTrans();
}

function showRes(i) {
    document.getElementById("show_status").innerHTML += "<p> No." + i + ", " + result[i] + " </p>";
}

function doit() {
    if (safety == 0) {
        safety++;
        addressInit();
        document.getElementById('start_btn').innerHTML="停下来喂";
        runTrans();
        saveResult();
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



////////////
/**
 * Thank Wandergis for provinding the converting function!
 * Created by Wandergis on 2015/7/8.
 */

const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

function gcj02towgs84_lng(lng, lat) {
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;

    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    return lng - dlng;
}

function gcj02towgs84_lat(lng, lat) {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;

    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    return lat - dlat;
}

function transformlat(lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
}

function transformlng(lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
}

function out_of_china(lng, lat) {
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}
