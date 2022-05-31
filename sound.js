var audio = document.getElementById("audio");
var playPauseBTN = document.getElementById("playPauseBTN");
var count = 0;

playPauseBTN.addEventListener("click", playPause);

// function playPause() {
//   console.log("aa");
//   let A = new Audio("music/theme.mp3");
//   if (count == 0) {
//     count = 1;
//     A.play();
//   } else {
//     count = 0;
//     A.pause();
//   }
// }

function playPause() {
  mediaPlayer = document.getElementById("music");
  mediaPlayer2 = document.getElementById("oui");

  console.log(mediaPlayer2);
  if (mediaPlayer.paused) {
    mediaPlayer2.className = "play";
    mediaPlayer.play();
  } else {
    mediaPlayer2.className = "mute";
    mediaPlayer.pause();
  }
}
