const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var duration = 750,
  spinnerID,
  frames = "|/-\\".split('');

function step(timestamp) {
  var frame = Math.floor(timestamp*frames.length/duration) % frames.length;
  window.document.getElementById('spinner').innerHTML = `[${frames[frame]}]`;
  spinnerID = requestAnimationFrame(step);
}

export function startSpinner() {
  document.getElementById("input").style.display= 'none';
  document.getElementById('wrapper').lastChild.children[0].insertAdjacentHTML('beforeEnd',`<span id="spinner"></span>`);
  spinnerID = requestAnimationFrame(step);
};

export function stopSpinner() {
  cancelAnimationFrame(spinnerID);
  window.document.getElementById('spinner').remove();
  document.getElementById("input").style.display= 'block';
  document.getElementById('screen').scrollTop = document.getElementById('screen').scrollHeight; //ensure input is visible
  document.getElementById("input_source").focus(); //ensure input gets focus
};
