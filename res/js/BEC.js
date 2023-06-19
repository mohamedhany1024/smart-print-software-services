let file = null;
let canvas;
let ctx;
let fileURL = null;

let ePage = 2;
let oPage = 3;
let quality = 1.5;

let eTop = 0;
let  eBottom = 0; 
let eRight = 0; 
let eLeft = 0; 
let oTop = 0;
let oBottom = 0;
let oRight = 0;
let oLeft = 0;
window.jsPDF = window.jspdf.jsPDF

//var pdfjsLib = window['libs/pdfjs/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'libs/pdfjs/build/pdf.worker.js';
function backToHome() {
    window.location.href = "../launcher.html";
}
canvas = document.getElementById("the-canvas");
ctx = canvas.getContext('2d');

function start() {
    if (file != null) {
        openScreen("config");
    } else {
        alert("No File selected. Please select a file first");
    }
}

function start2() {
    if (file != null) {
        let qualitySelect = document.getElementById("qualitySelect");
        let ram = navigator.deviceMemory;
        console.log(`Ram: ${ram}`);
        ePage = document.getElementById("evenNo").value;
        oPage = document.getElementById("oddNo").value;
        console.log(ePage);
        console.log(oPage);
        
        quality = qualitySelect.options[qualitySelect.selectedIndex].value;

        if (ram != null) {
            if (quality > 1.5 && parseInt(ram) < 6) {
                openDialogue("dBox3");
            }
        }
        
        openScreen("editor");
        //file preparation
        document.getElementById("fileNameDisp").innerText = file.name;
        fileURL = URL.createObjectURL(file);
        //console.log(fileURL);
        var pdfDoc;

        //canvas setup
        
        
        pdfjsLib.disableWorker = true;

        //
        let loadingTask = pdfjsLib.getDocument({url : fileURL});
        loadingTask.promise.then(
            function getPdf(_pdfDoc) {
                pdfDoc = _pdfDoc;

                pdfDoc.getPage(parseInt(ePage)).then(
                    function (page) {
                        var viewport = page.getViewport({scale: quality});
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        // Render PDF page into canvas context
                        var renderContext = {
                            canvasContext: ctx,
                            viewport: viewport
                        };
                        var renderTask = page.render(renderContext);

                        renderTask.promise.then ( 
                            ()=> {
                                console.log("rendering finished");
                            }
                        );
                    }
                );
            }
        );
        

    } else {
        alert("No File selected. Please select a file first");
    }
}

let pageParityState = 0;
let pageNo = 0;
let currentPage = 1;


function next() {
    if (pageParityState == 0) {
        let loadingTask = pdfjsLib.getDocument({url : fileURL});
        loadingTask.promise.then(
            function getPdf(_pdfDoc) {
                pdfDoc = _pdfDoc;

                pdfDoc.getPage(parseInt(oPage)).then(
                    function (page) {
                        var viewport = page.getViewport({scale: quality});
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        // Render PDF page into canvas context
                        var renderContext = {
                            canvasContext: ctx,
                            viewport: viewport
                        };
                        var renderTask = page.render(renderContext);

                        renderTask.promise.then ( 
                            ()=> {
                                console.log("rendering finished");
                                pageParityState = 1;

                                
                            }
                        );
                    }
                );
            }
        );
    } else {
        pageParityState = 0;
        openDialogue("dBox1");
        bulkProcess();
    }
}



function topErase(topNum) {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

let data = imageData.data;
    //console.log("datataa");
    for (i=0; i<=topNum*4*canvas.width; i+=4) {
        data[i] = 255;
        data[i+1] = 255;
        data[i+2] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}

function bottomErase(bottomNum) {
    //console.log(`FUCK ${bottomNum}`);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

let data = imageData.data;
    //console.log(data);
    //console.log("datataa");
    for (i=data.length-1; i!=(data.length-1)-(bottomNum*4*canvas.width); i-=4) {
        data[i-1] = 255;
        data[i-2] = 255;
        data[i-3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
}

function leftErase(leftNum) {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let data = imageData.data;
    let elapsed = 0;
    let masterElapsed = 0;
    for (i=0; i<= data.length-(canvas.width-(leftNum*4)); i+=4) {
        
        data[i] = 255;
        data[i+1] = 255;
        data[i+2] = 255;
        elapsed++;
        masterElapsed++;
        if (elapsed == leftNum) {
            i+= ((canvas.width*4) - (leftNum*4));
            elapsed = 0;
            
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function rightErase(rightNum) {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let data = imageData.data;
    let elapsed = 0;
    let masterElapsed = 0;
    for (i=data.length-1; i>= (canvas.width*4)-((rightNum*4)); i-=4) {
        
        data[i-1] = 255;
        data[i-2] = 255;
        data[i-3] = 255;
        elapsed++;
        masterElapsed++;
        if (elapsed == rightNum) {
            i-= ((canvas.width*4) - (rightNum*4));
            elapsed = 0;
            
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function apply() {
    if (pageParityState == 0) {
        //console.log(document.getElementById("iTop").value);
        eTop = document.getElementById("iTop").value;
        eBottom = document.getElementById("iBottom").value;
        eRight = document.getElementById("iRight").value;
        eLeft = document.getElementById("iLeft").value;
        bottomErase(eBottom);
        topErase(eTop);
        leftErase(eLeft);
        rightErase(eRight);
    } else {
        oTop = document.getElementById("iTop").value;
        oBottom = document.getElementById("iBottom").value;
        oRight = document.getElementById("iRight").value;
        oLeft = document.getElementById("iLeft").value;

        bottomErase(oBottom);
        topErase(oTop);
        leftErase(oLeft);
        rightErase(oRight);
    }


    
}

async function mahrosa(pageNumero) {
    if (pageNumero % 2 == 0) {
        bottomErase(eBottom);
        topErase(eTop);
        leftErase(eLeft);
        //console.log("eR: "+eRight);
        rightErase(eRight);
    } else {
        bottomErase(oBottom);
        topErase(oTop);
        leftErase(oLeft);
        rightErase(oRight);
        //console.log("oR: "+oRight);
    }
}
const pdf = new jsPDF();
let img;
let page = 1;
async function toPDF() {
    img = canvas.toDataURL();
    //console.log("adding ");
    //console.log(img);
    //window.open(img, "_blank");
    pdf.addImage(img, 'png', 0, 0, 210, 297);
    if (page < pageNo) {
        pdf.addPage();
    }
    page++;
    
}

let jobFinished = false;
function bulkProcess() {
    //console.log("i'm working :)");
    //document.getElementById("the-canvas").style.display = "none";
    
    let loadingTask = pdfjsLib.getDocument({url : fileURL});
        loadingTask.promise.then(
            function getPdf(_pdfDoc) {
                pdfDoc = _pdfDoc;
                pageNo = pdfDoc.numPages;
                pdfDoc.getPage(currentPage).then(
                    function (page) {
                        
                        //console.log(pageNo);
                        //console.log(currentPage);
                        var viewport = page.getViewport({scale: quality});
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        // Render PDF page into canvas context
                        var renderContext = {
                            canvasContext: ctx,
                            viewport: viewport
                        };
                        var renderTask = page.render(renderContext);

                        renderTask.promise.then ( 
                            ()=> {
                                console.log("rendering finished");
                                
                                //console.log("Kaka?");
                                
                                    mahrosa(currentPage).then(
                                        ()=> {
                                            currentPage++;
                                            img = canvas.toDataURL();
                                            toPDF();
                                             //console.log(currentPage);
                                            if (currentPage > pageNo) {
                                                jobFinished = true;
                                            }
                                            if (!jobFinished) {
                                                
                                                
                                                
                                                    
                                                        setTimeout(()=> {
                                                            document.getElementById("progress").innerText = `${(currentPage/pageNo) * 100}%`;
                                                            bulkProcess();
                                                        }, 50);
                                                    
                                               
                                                
                                            } else {
                                                setTimeout(()=> {
                                                    closeDialogue("dBox1");
                                                    openDialogue("dBox2");
                                                    pdf.save("res.pdf");
                                                }, 2000);
                                                //console.log("am i done??");
                                            }

                                        }
                                    );

                                    
                                
                                
                                
                            }
                        );
                    }
                );
            }
        );
}




let filePicker = document.getElementById("filePicker");


filePicker.onchange = e => {
    file = e.target.files[0];
    //console.log(file.name);
}



