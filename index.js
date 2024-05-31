const input = document.getElementById("input");
const canvas = document.getElementById("canvas");

input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.addEventListener("load", (event) => {
    const arrayBuffer = event.target.result;
    let context = new (window.AudioContext || window.webkitAudioContext)();
    context.decodeAudioData(arrayBuffer, (buffer) => {
      visualize(buffer, context);
    });
  });
  reader.readAsArrayBuffer(file);
});

function visualize(audioBuffer, audioContext) {
  const canvasContext = canvas.getContext("2d");
  console.log(canvas);
  canvas.width = canvas.clientWidth;
  canvas.height = 300;
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 256;
  const freqData = new Uint8Array(analyser.frequencyBinCount);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  source.start();

  const center = canvas.height / 2;
  const barWidth = canvas.width / freqData.length;

  function draw() {
    requestAnimationFrame(draw);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(freqData);
    for (let i = 0; i < freqData.length; i++) {
      canvasContext.fillStyle = `rgba(28,113,255,${freqData[i] / 255})`;
      canvasContext.fillRect(
        i * barWidth,
        canvas.height - freqData[i],
        barWidth - 1,
        freqData[i]
      );
    }
  }

  draw();
}
