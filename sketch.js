// Examples use jsonplaceholder.typicode.com for a Mock Data API
var cors = "https://cors-anywhere.herokuapp.com/";
var host = "https://09bd02f383bbe844.gradio.app";
var text2img = "/sdapi/v1/txt2img";
var img2img = "/sdapi/v1/img2img";

var img = null;
var imgsrc = null;

// MQTT client details:
let broker = {
  hostname: '34.172.96.169',
  port: 9110
};
// MQTT client:
let client;
// client credentials:
let creds = {
  clientID: 'b4rretto',
  userName: 'participants',
  password: 'prp1nterac'
}
// topic to subscribe to
let subTopic = 'jiboia13';
let topic = 'hiper/jiboia13';

// let flock;

var load = {
  prompt: "leaf texture, closeup",
  steps: 25,
  strength: 0.8,
  seed: -1,
  width: 512,
  height: 320,
};

let drops = [];
let maxPixels = 2500;
let timer = 0;
let update = false;

function setup() {
  createCanvas(displayWidth, displayHeight);
  noStroke();
  MQTTconnect();
  pixelDensity(1);
  for (let j = 1; j <= 16; j++) {
    let xoff = random(1000);
    for (let i = 0; i < maxPixels / 16; i++) {
      let p = new Pixel(j%4, int(j/4),width / load.width, xoff);
      drops.push(p);
    }
    frameRate(30);
  }
  newImage();
  setInterval(newImage, 300000);
}

function draw() {
  background(0, 2);
  if (img) {
    for (pixel of drops) {
      pixel.update();
      pixel.show(img.pixels);
    }
  }
}

function MQTTconnect() {
  client = new Paho.MQTT.Client(broker.hostname, Number(broker.port), creds.clientID);
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect(
    {
      onSuccess: onConnect,
      userName: creds.userName,
      password: creds.password,
      useSSL: false
    }
  );
}

function onConnect() {
  console.log('client is connected');
  client.subscribe(topic);
}

function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log('onConnectionLost:' + response.errorMessage);
  }
}

function onMessageArrived(message) {
  let payload = message;
  var data = JSON.parse(message.payloadString);
  load.strength = data;
  // console.log(data);
}

function newImage() {
  var api = (img) ? img2img : text2img;
  var url = cors + host + api;
  postData(url, load)
    .then((data) => {
      if (data.images && data.images.length > 0) {
        var imgsrc = "data:image/png;base64," + data.images[0];
        load.init_images = [imgsrc];
        loadImage(imgsrc, i => {
          img = i;
          img.loadPixels();
        });
      }
    });
}

async function postData(url = '', data = {}) {
  console.log(url);
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

function mousePressed() {
  let fs = fullscreen();
    fullscreen(!fs);
}


