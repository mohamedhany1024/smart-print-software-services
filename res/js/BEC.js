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
window.jsPDF = window.jspdf.jsPDF;

let successSound = new Audio();
successSound.src = "../res/sounds/success.ogg";

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
        openDialogue("dBox4");
    }
}

let pageParityState = -1;

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
        
        
        if (pageParityState == -1) {
            //pageParityState = 0;
            pdfjsLib.disableWorker = true;

        
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
        }
        

    } else {
        alert("No File selected. Please select a file first");
    }
}


let pageNo = 0;
let currentPage = 1;


function next() {
    if (pageParityState == -1) {
        pageParityState = 0;
        load_em(0);
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
                                //pageParityState = 1;

                                
                            }
                        );
                    }
                );
            }
        );
    } else {
        pageParityState = -1;
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

function reset() {
    if (pageParityState == -1) {
        eTop = 1;
        eBottom = 1;
        eLeft = 1;
        eRight = 1;
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
                                //pageParityState = 1;

                                
                            }
                        );
                    }
                );
            }
        );
    } else if (pageParityState == 0) {
        oTop = 1;
        oBottom = 1;
        oLeft = 1;
        oRight = 1;
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
                                //pageParityState = 1;

                                
                            }
                        );
                    }
                );
            }
        );
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
const pdf = new jsPDF('p', 'mm', 'a4', true);
let img;
let page = 1;
async function toPDF() {
    img = canvas.toDataURL();
    //console.log("adding ");
    //console.log(img);
    //window.open(img, "_blank");
    pdf.addImage(img, 'PNG', 0, 0, 210, 297);
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
                                                            document.getElementById("progress").innerText = `${Math.trunc((currentPage/pageNo) * 100)}%`;
                                                            bulkProcess();
                                                        }, 50);
                                                    
                                               
                                                
                                            } else {
                                                setTimeout(()=> {
                                                    closeDialogue("dBox1");
                                                    openDialogue("dBox2");
                                                    successSound.play();
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



function save_em() {
    //localStorage.clear();
    localStorage.setItem("eTop", eTop);
    localStorage.setItem("eBottom", eBottom);
    localStorage.setItem("eRight", eRight);
    localStorage.setItem("eLeft", eLeft);

    localStorage.setItem("oTop", oTop);
    localStorage.setItem("oBottom", oBottom);
    localStorage.setItem("oRight", oRight);
    localStorage.setItem("oLeft", oLeft);
}

function load_em(parity) {
    if (parity == -1) {
        
        document.getElementById("iTop").value = parseInt(localStorage.getItem("eTop"));
        document.getElementById("iBottom").value = parseInt(localStorage.getItem("eBottom"));
        document.getElementById("iRight").value = parseInt(localStorage.getItem("eRight"));
        document.getElementById("iLeft").value = parseInt(localStorage.getItem("eLeft"));
    } else {
        //alert(parseInt(localStorage.getItem(eTop)));
        document.getElementById("iTop").value = parseInt(localStorage.getItem("oTop"));
        document.getElementById("iBottom").value = parseInt(localStorage.getItem("oBottom"));
        document.getElementById("iRight").value = parseInt(localStorage.getItem("oRight"));
        document.getElementById("iLeft").value = parseInt(localStorage.getItem("oLeft"));
    }
}

load_em(-1);

setInterval(()=> {
    if (pageParityState == -1) {
        eTop = document.getElementById("iTop").value;
        eBottom = document.getElementById("iBottom").value;
        eRight = document.getElementById("iRight").value;
        eLeft = document.getElementById("iLeft").value;
    } else {
        oTop = document.getElementById("iTop").value;
        oBottom = document.getElementById("iBottom").value;
        oRight = document.getElementById("iRight").value;
        oLeft = document.getElementById("iLeft").value;
    }
}, 1000);

