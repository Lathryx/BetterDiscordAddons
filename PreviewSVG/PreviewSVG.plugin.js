/** 
 * @name PreviewSVG 
 * @author Lathryx 
 * @version 0.0.1 
 * @description Preview SVG files in Discord. 
 * @website https://github.com/Lathryx 
 */ 

// First plugin! If you have any suggestions, please let me know. :) 
// Special thanks to this guide: https://zerthox.github.io/guides/bd/getting-started/ (and of course the BD docs) 

const { React } = BdApi; 

const PreviewSVG = (src) => React.createElement(
    "img", 
    { 
        src: "data:image/svg+xml;base64," + btoa(src), 
        className: "preview-svg-img", 
        style: { 
            width: "100%", 
            height: "100%", 
            objectFit: "contain" 
        } 
    } 
); 

const PreviewBtn = (svg) => {
    let el = document.createElement( "button", { class: "preview-svg-btn" }, "👁‍🗨" ); 
    el.style.width = "25px"; 
    el.style.height = "25px"; 
    el.style.border = "none"; 
    el.style.borderRadius = "50%"; 
    el.style.background = "white"; 
    el.style.opacity = "0.5"; 
    el.style.transition = "opacity 0.5s ease"; 

    el.innerText = "👁‍🗨"; 
    el.addEventListener('mouseenter', e => {
        el.style.opacity = "1";  
    }); 
    el.addEventListener('mouseleave', e => { 
        el.style.opacity = "0.5"; 
    }); 

    el.addEventListener('click', e => { 
        // BdApi.alert("SVG Preview", PreviewSVG(svg)); // uses alert modal (DEPRECATED) 
        BdApi.UI.showConfirmationModal("SVG Preview", PreviewSVG(svg), {cancelText: "", confirmText: "Close"}); // uses confirmation modal 
    }); 

    return el; 
}; 

const filePreviewToSVG = (fileText) => {
    let svg = ""; 
    fileText.querySelectorAll("pre code span").forEach(el => {
        svg += el.innerText; 
    }); 
    let svgStartIndex = svg.indexOf("<svg"); 
    let svgEndIndex = svg.indexOf("</svg>") + 6; 
    return svg.slice(svgStartIndex, svgEndIndex); 
}

const handleClick = e => {
    // if event path contains element with class "openFullPreviewSection-31zc2v" (thanks CoPilot) 
    let openFullPreviewBtn = e.path.find(el => el.classList && el.classList.contains("openFullPreviewSection-31zc2v")); 

    if (openFullPreviewBtn) {
        // find the file preview layer and relevant elements 
        let fileModal = document.querySelector("div#app-mount div.appDevToolsWrapper-1QxdQf div.notDevTools-1zkgfK > div.layerContainer-2v_Sit div.layer-1Ixpg3 div.focusLock-2tveLW div.modalRoot-27psNz div.modalContent-1zPatc"); 
        let fileText = fileModal.querySelector("div.modalTextContainer-1FUO2W"); 
        let fileToolbar = fileModal.querySelector("div.footer-GXWBBp"); 

        let svg = filePreviewToSVG(fileText); 
        let previewBtn = PreviewBtn(svg); 
        fileToolbar.prepend(previewBtn); 
    } 
}; 

module.exports = (meta) => {
    return {
        start() {
            document.addEventListener("click", handleClick); 
        }, 
        stop() {
            document.removeEventListener("click", handleClick); 
        }
    }; 
}; 