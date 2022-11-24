let currTrack = 0;
document.getElementById('play_control').addEventListener('click', musicPlay);
document.getElementById('next_control').addEventListener('click', nextTrack);
document.getElementById('prev_control').addEventListener('click', prevTrack);
const playlist = [
    {src: 'TH3WORM/TH3WORM_-_Pilot_Maneuver.mp3'},
    {src: 'TH3WORM/are_you_there.mp3'},
    {src: 'TH3WORM/supreme_tranquility.mp3'},
    {src: 'TH3WORM/battle_for_the_network_state.mp3'},
    {src: 'TH3WORM/crypto_melt.mp3'},
    {src: 'TH3WORM/dark_dns.mp3'},
    {src: 'TH3WORM/shoot_to_kill_or_die.mp3'},
    {src: 'TH3WORM/th3worm_skeleton_crew.mp3'},
    {src: 'TH3WORM/we_came_here_to_die.mp3'}
];
const audioSrc = document.querySelector('#th3worm>source');
const playBtn = document.getElementById('play_control');
const audioEle = document.getElementById('th3worm');
if (audioSrc && playlist) {audioSrc.setAttribute('src', playlist[0].src)};
audioEle.load();

function musicPlay() {
    audioEle.play();
    playBtn.removeEventListener('click', musicPlay);
    playBtn.addEventListener('click', musicPause);
    playBtn.innerHTML = "||";
};
function musicPause() {
    audioEle.pause();
    playBtn.removeEventListener('click', musicPause);
    playBtn.addEventListener('click', musicPlay);
    playBtn.innerHTML = ">";
};
function nextTrack() {
    musicPause();
    currTrack = (currTrack == playlist.length - 1)?0:(currTrack + 1);
    audioSrc.setAttribute('src', playlist[currTrack].src);
    audioEle.load();
    musicPlay();
};
function prevTrack() {
    musicPause();
    currTrack = (currTrack == 0)?(playlist.length - 1):(currTrack - 1);
    audioSrc.setAttribute('src', playlist[currTrack].src);
    audioEle.load();
    musicPlay();
};
