import os from 'os';
import express from 'express';

const port = process.env.PORT || 3000;


// Array of HTML fragments (no DOM manipulation needed)
let surprises = [
  `<h2>🎯 Click the target!</h2>
   <div style="font-size:100px;cursor:pointer;" onclick="alert('You hit it! 🎉')">🎯</div>`,

  `<h2>😂 Joke of the moment</h2>
   <p>Why did the dolphin get a job in Kubernetes?<br>Because it already knew how to work in pods.</p>`,

  `<h2>🎨 Draw!</h2>
   <canvas id="canvas" width="300" height="300" style="border:1px solid black;"></canvas>
   <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let drawing = false;
      canvas.addEventListener('mousedown',()=>drawing=true);
      canvas.addEventListener('mouseup',()=>drawing=false);
      canvas.addEventListener('mousemove',e=>{
        if(!drawing) return;
        ctx.fillRect(e.offsetX, e.offsetY, 4, 4);
      });
   </script>`,

  `<h2>🤖 Random Fact</h2>
   <p>Minikube was originally created in 2016 to make local Kubernetes testing easier!</p>`,

  `<h2>🎵 Click anywhere for a sound!</h2>
   <script>
     document.body.addEventListener('click', () => {
       new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg").play();
     }, { once: true });
   </script>`
];


//Style from env variables
const backgroundColor = process.env.BG_COLOR || 'white';
const fontColor = process.env.FONT_COLOR || 'black';
const borderSize = process.env.BORDER_SIZE || '2px';
const borderStyle = process.env.BORDER_STYLE || 'dashed';
const borderColor = process.env.BORDER_COLOR || '#ccc';

function renderPage(surpriseContent) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>KubeChaos @ RSECon26</title>
  <style>
    body { font-family: 'sans-serif'; text-align: center; margin-top: 5rem; background-color: ${backgroundColor};
    color: ${fontColor};}
    #playground { height: 400px; border: ${borderSize} ${borderStyle} ${borderColor}; margin-top: 20px; }
    button { padding: 10px 20px; font-size: 1rem; cursor: pointer; }
  </style>
  <link rel="stylesheet" href="/style.css" >
</head>
<body>
  <h1>KubeChaos @ RSECon26!</h1>
  <p>Served by pod: <strong>${os.hostname()}</strong></p>
  <p>Every refresh brings a new surprise 🎲</p>
  <div id="playground">
    ${surpriseContent}
  </div>
</body>
</html>
`;
};
const server = express();

server.use(express.static('public'));

if (process.env.ENABLE_POD_DESTROY === "true") {
  // Array of HTML fragments (no DOM manipulation needed)
  surprises.push(
    `<h2>💣 Click to destroy!</h2>
  <button onclick="destroyPod()" style="font-size:20px;padding:10px;background:red;color:white;border:none;cursor:pointer;">💀 DESTROY POD NOW 💀</button>
  <script>
    function destroyPod() {
      document.body.innerHTML = '<div style="background:black;color:red;font-size:50px;text-align:center;padding-top:200px;">💀 DESTROYING POD... 💀</div>';
      console.log('Sending destroy request...');
      fetch('/destroy', {method: 'POST'})
        .then(response => {
          console.log('Destroy response:', response.status);
          document.body.innerHTML = '<div style="background:black;color:red;font-size:50px;text-align:center;padding-top:200px;">💀 POD DESTROYED 💀</div>';
        })
        .catch(error => {
          console.error('Destroy failed:', error);
          // Fallback - still try to show destruction
          document.body.innerHTML = '<div style="background:black;color:red;font-size:50px;text-align:center;padding-top:200px;">💀 POD DESTROYED 💀</div>';
        });
    }
  </script>`);

  server.post("/destroy", (req, res) => {
    console.log("💀💀💀 DESTRUCTION ENDPOINT HIT! 💀💀💀");
    res.status(200).json({ message: "Pod is being destroyed!" });
    console.log("🔥 KILLING PROCESS NOW...");

    // Multiple ways to ensure the process dies
    setTimeout(() => {
      console.log("💥 PROCESS.EXIT(1)");
      process.exit(1);
    }, 100);

    setTimeout(() => {
      console.log("💥 PROCESS.EXIT(143) - SIGTERM");
      process.exit(143);
    }, 200);

    setTimeout(() => {
      console.log("💥 THROWING UNCAUGHT EXCEPTION");
      throw new Error("INTENTIONAL CRASH FOR KUBERNETES EXPERIMENT");
    }, 300);
  });
}

server.get('/', (req, res) => {
  const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
  res.set("Cache-Control", "no-cache, no-store");
  res.set("Content-Type", "text/html");
  res.send(renderPage(randomSurprise));
});

server.listen(port, () => {
  console.log('Server is running on http://localhost:3000');
});
