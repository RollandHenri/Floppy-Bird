const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "/media/flappy-bird-set.png";

/*** Settings ***/

let gamePlaying = false;
const gravity = 0.5;
const speed = 6;
const size = [51, 36];
const jump = -11;
const cTenth = canvas.width / 10;

/*** Pipes Settings ***/

const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => Math.random() * (canvas.height - (pipeGap + pipeWidth));

let index = 0;
let bestScore = 0;
let currentScore = 0;
let pipes = [];
let flight;
let flyHeight;

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2;

  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
};

const render = () => {
  index++;

  /*** Background ***/
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );

  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2;

    ctx.fillText(`Meilleur scrore: ${bestScore}`, 50, 245);
    ctx.fillText("Cliquez pour jouer", 45, 535);
    ctx.font = "bold 30px courier";
  }

  /*** Pipe Display ***/

  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;

      /*** top Pipe ***/
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );

      /*** Bottom Pipe ***/

      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        /*** Create New Pipe ***/

        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
      }

      /*** Hit the pipe ***/
      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  document.getElementById("bestScore").innerHTML = `Meilleur: ${bestScore}`;
  document.getElementById("bestScore").innerHTML = `Actuel: ${currentScore}`;

  window.requestAnimationFrame(render);
};

setup();
img.onload = render;

document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);
