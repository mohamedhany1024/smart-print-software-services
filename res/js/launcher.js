function splashAnim() {
    document.getElementById("bg").style.display = "none";
    setTimeout(()=> {
        document.getElementById("logo").style.filter = "saturate(1)";
        document.getElementById("loader").style.opacity = "0";
        setTimeout(()=> {
            /*document.getElementById("splash").style.opacity = "0";
            document.getElementById("splash").style.transform = "scale(1.5)";*/
            setTimeout(()=>{
                openScreen("appsMenu");
                document.getElementById("bg").style.display = "block";
            }, 500);
        }, 2000);
    }, 6000);
}

splashAnim();

function openApp(appName) {
    window.open(`layouts/${appName}.html`, "_blank");
}