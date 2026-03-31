
var left = 0;
var leftMax = 180;
var loading, timer, numbers, qrImage;

var secret;
var privateKey;
var publicKey;
var sessionUuid;
var qrCode;

// Fallback for delay if not defined by bar.js
if (typeof delay !== 'function') {
    function delay(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }
}

function initShowQR() {
    loading = document.querySelector('.loading_bar');
    timer = document.querySelector('.expire_highlight');
    numbers = document.querySelector('.numbers');
    qrImage = document.querySelector('.qr_image');
    if (loading && timer && qrImage) { setLeft(); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowQR);
} else {
    initShowQR();
}
function setLeft() {
    if (left == 0) {
        generateQR();
        left = leftMax;
    }
    var min = parseInt(left / 60);
    var sec = parseInt(left - min * 60);
    if (min == 0) {
        timer.innerHTML = sec + " sek."
    } else {
        timer.innerHTML = min + " min " + sec + " sek."
    }
    loading.style.width = (left / leftMax) * 100 + "%"
    left--;
    delay(1000).then(() => {
        setLeft()
    })
}

function generateQR() {

    // Mock local generation
    var mockResult = {
        qrCode: "https://mobywatel.gov.pl/" + Math.random().toString(36).substring(7),
        code: Math.floor(100000 + Math.random() * 900000).toString(),
        secret: "mock_secret",
        encodedPublicKey: "mock_key",
        encodedPrivateKey: "mock_key",
        sessionUuid: "mock_uuid"
    };

    // Simulate delay then process
    new Promise(resolve => setTimeout(() => resolve(mockResult), 500))
        .then(result => {

            qrCode = result.qrCode;

            qrImage.innerHTML = "";
            try {
                var qr = new QRCode(qrImage, {
                    text: qrCode,
                    width: 300,
                    height: 300,
                    correctLevel: QRCode.CorrectLevel.M
                });
            } catch (e) { console.error("QRCode error", e); }

            if (numbers) numbers.innerHTML = result.code

            secret = result.secret;
            publicKey = result.encodedPublicKey;
            privateKey = result.encodedPrivateKey;
            sessionUuid = result.sessionUuid;

            awaitResponse();
        })

}

function awaitResponse() {

    // Mock waiting loop - does nothing but keep console clean
    console.log("Simulating waiting for scan...");

    // We could simulate success after random time, but for 'show' usually we wait indefinitely until scanned.
    // Without backend, we can't know if it's scanned. So just do nothing or simulate success after 10s?
    // Let's just do nothing to avoid annoying redirects.

}

async function saveTemporaryData(data) {
    var db = await getDb();

    data['data'] = 'temp';
    await saveData(db, data);

    sendTo('display');
}

function randomSixDigit() {
    return Math.floor(100000 + Math.random() * 900000);
}
document.addEventListener("DOMContentLoaded", function () {
    const numbersElem = document.querySelector('.numbers');
    if (numbersElem) {
        numbersElem.textContent = randomSixDigit();
    }
});