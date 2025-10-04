// ===== script.js =====

const video = document.getElementById("video");
const captureBtn = document.getElementById("capture");
const retakeBtn = document.getElementById("retake");
const downloadBtn = document.getElementById("download-btn");
const resultDiv = document.getElementById("result");
const collageCanvas = document.getElementById("collage");
const ctx = collageCanvas.getContext("2d");

let images = [];

// 📸 Bật camera
async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
}

startCamera();

// 📷 Chụp ảnh
captureBtn.addEventListener("click", async () => {
    if (images.length < 6) {
        let canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let context = canvas.getContext("2d");
        context.drawImage(video, 0, 0);
        images.push(canvas);
        captureBtn.innerText = `📸 Đã chụp ${images.length}/6`;

        if (images.length === 6) {
            createCollage();
        }
    }
});

// 🔄 Chụp lại
retakeBtn.addEventListener("click", () => {
    images = [];
    resultDiv.style.display = "none";
    captureBtn.innerText = "📸 Chụp ảnh";
});

// 🖼️ Ghép 6 ảnh thành 1 ảnh collage
function createCollage() {
    const w = 800;
    const h = 1200;
    collageCanvas.width = w;
    collageCanvas.height = h;

    // Nền caro xanh nhạt
    ctx.fillStyle = "#d6f5d6";
    ctx.fillRect(0, 0, w, h);

    let cols = 2;
    let rows = 3;
    let padding = 20;
    let imgW = (w - padding * (cols + 1)) / cols;
    let imgH = (h - padding * (rows + 1)) / rows;

    images.forEach((img, i) => {
        let col = i % cols;
        let row = Math.floor(i / cols);
        ctx.drawImage(img, padding + col * (imgW + padding), padding + row * (imgH + padding), imgW, imgH);
    });

    // 📍 Logo dưới
    ctx.fillStyle = "#ffcc99";
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 50, 180, 50, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#ff3399";
    ctx.font = "bold 40px Pacifico";
    ctx.textAlign = "center";
    ctx.fillText("PHOTOBOX", w / 2, h - 35);

    resultDiv.style.display = "block";
}

// 💾 Tải ảnh
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "photobooth.png";
    link.href = collageCanvas.toDataURL();
    link.click();
});
