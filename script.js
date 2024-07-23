let currentSong = new Audio();
let songs;
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    // Fetch the list of songs
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        if (as[i].href.endsWith(".mp3")) {
            songs.push(as[i].href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".song-info").innerHTML = track;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
    
    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".song-time").innerHTML = `00:00 / ${formatTime(currentSong.duration)}`;
    });
}

async function main() {
    // Get the list of all the songs
    songs = await getSongs();

    // Play the first song
    if (songs.length > 0) {
        playMusic(songs[0], true);
    }

    // Show all the songs in the playlist
    let songUl = document.querySelector(".song-list ul");
    for (const song of songs) {
        const cleanedSong = song.replaceAll("%20", " ");
        songUl.innerHTML += `
            <li> <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${cleanedSong}</div>
                <div>Song Artist</div>
            </div>
            <img class="invert" src="play.svg" alt="">
            ${cleanedSong}
            </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const trackName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(trackName);
        });
    });

    // Attach an event listener to play/pause button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    // Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })
    //add event listner for close of hamburger
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-110%";
    })
    //add an event listener to previous 
    previous.addEventListener("click", ()=>{
        // console.log(currentSong.src)
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index-1 >=0){
            playMusic(songs[index-1]);
        }
        // console.log(currentSong.src.split("/").slice(-1)[0]);
        // console.log(songs,index)
    })
    //add an event listener to  next
    next.addEventListener("click", ()=>{
        console.log(currentSong.src)
    //    currentSong.pause();
       console.log("next clicked")
        // console.log(currentSong.src.split("/").slice(-1)[0])
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index+1 < songs.length){
            playMusic(songs[index+1]);
        }
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("setting vol : ", e.target.value)
        currentSong.volume= parseInt(e.target.value)/100;
    })
    
}

main();
