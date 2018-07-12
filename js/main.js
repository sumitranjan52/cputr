/* Arbitrary Variables */
var width = 500, height = 0, filter = 0, streaming = false;

/* DOM Element */
function _(e) { return document.querySelector(e); }

var video = _("#video"), capture = _("#capture"), clear = _("#clear"),
imgFilter = _("#image-filter"), canvas = _("#img-canvas"),
imgHolder = _("#img-holder"), toggleImg = _("#show-hide"), imgContain = _(".img-container");

/* Check playback */
video.addEventListener('canplay', function (e) {
  height = video.videoHeight / (video.videoWidth / width);
  video.setAttribute('width',width);
  video.setAttribute('height',height);
  canvas.setAttribute('width',width);
  canvas.setAttribute('height',height);
  streaming = true;
});

/* Load stream on page */
navigator.mediaDevices.getUserMedia({video:{width:1280, height: 720}})
.then(function (stream) {
  video.srcObject = stream;
  video.play();
}).catch(function (err) {
  console.error("Error: " + err);
});

function captureImg() {
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);
  context.font = "16px cursive";
  context.filter = imgFilter.value;
  context.fillStyle = "#fff";
  context.fillText('cPutr', 20, 20);
  var imgUrl = canvas.toDataURL('image/png');
  var img = document.createElement('img');
  img.src = imgUrl;
  img.setAttribute('width',width);
  img.setAttribute('height',height);
  img.style.filter = imgFilter.value;
  imgHolder.prepend(img);
  imgContain.style.display = "block";
  imgContain.setAttribute('data-toggle','show');
}

function clearImg() {
  imgHolder.innerHTML = "";
  filter = 'none';
  video.style.filter = filter;
  imgFilter.selectedIndex = 0;
  imgContain.style.display = "none";
  imgContain.setAttribute('data-toggle','hide');
}

function toggleImage() {
  if (imgContain.getAttribute('data-toggle') == "hide") {
    imgContain.style.display = "block";
    imgContain.setAttribute('data-toggle','show');
  }else{
    imgContain.style.display = "none";
    imgContain.setAttribute('data-toggle','hide');
  }
}

function changeNegFilter() {
  filter--;
  if(filter < 0 ) {
    filter = imgFilter.length-1;
  }
  imgFilter.selectedIndex = filter;
  video.style.filter = imgFilter.value;
}

function changePosFilter() {
  filter++;
  if(filter > imgFilter.length-1) {
    filter = 0;
  }
  imgFilter.selectedIndex = filter;
  video.style.filter = imgFilter.value;
}

/* Handle click events */
capture.addEventListener('click', function (e) {
  e.preventDefault();
  captureImg();
});

clear.addEventListener('click', function (e) {
  e.preventDefault();
  clearImg();
});

toggleImg.addEventListener('click', function (e) {
  toggleImage();
});

/* Apply image filter */
imgFilter.addEventListener('change', function (e) {
  video.style.filter = e.target.value;
});

/* Appling keyboard handler */
video.addEventListener('click', function(e) { captureImg(); });

document.addEventListener('keydown', function(e) {
  e.preventDefault();
  switch (e.keyCode) {
    case 32: captureImg(); break;
    case 8: clearImg(); break;
    case 13: toggleImage(); break;
    case 38: changeNegFilter(); break;
    case 40: changePosFilter(); break;
  }
});
