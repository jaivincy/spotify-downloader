async function downloadSong(){

    var song=document.getElementById("songLink").value;

    if(song==""){

        alert("Please paste Spotify Song URL");

        return;

    }

    document.getElementById("result").innerHTML = `
<div class="loading">
    <div class="loader"></div>
    <h3>Searching Spotify...</h3>
    <p>Please wait a moment</p>
</div>
`;

    

    const url="https://spotify-downloader9.p.rapidapi.com/downloadSong?songId="+encodeURIComponent(song);

    const options = {
    method: "GET",
    headers: {
        "x-rapidapi-key": "5ecb3d2944msh342f94808011546p1e804cjsnf43f75cb2ec7",
        "x-rapidapi-host": "spotify-downloader9.p.rapidapi.com"
    }
};

    try{
        const response = await fetch(url, options);

if (!response.ok) {
    throw new Error("API Error: " + response.status);
}

const data = await response.json();

        if(data.success){

document.getElementById("result").innerHTML=`

<div class="song-card">

    <img src="${data.data.cover}" class="cover">

    <div class="song-info">

        <span class="badge">
            <i class="fa-solid fa-circle-check"></i>
            Ready
        </span>

        <h2>${data.data.title}</h2>

        <p>
            <i class="fa-solid fa-user"></i>
            ${data.data.artist}
        </p>

        <p>
            <i class="fa-solid fa-compact-disc"></i>
            ${data.data.album}
        </p>

        <a href="${data.data.downloadLink}" target="_blank">

            <button class="download-btn">

                <i class="fa-solid fa-download"></i>

                Download MP3

            </button>

        </a>

    </div>

</div>

</div>

`;

saveHistory({

    title:data.data.title,

    artist:data.data.artist,

    cover:data.data.cover,

    time:new Date().toLocaleTimeString([],{

        hour:"2-digit",
        minute:"2-digit"

    })

});
updateCounter();
loadCounter();
showToast("Song Ready for Download!");
}

        else{

        document.getElementById("result").innerHTML="Song not found.";

showToast("Song not found!");

        }

    }

    catch(error){

    console.log(error);

    let message = "";

    if(error.message.includes("404")){
        message = "❌ Song Not Found";
    }
    else if(error.message.includes("429")){
        message = "⚠️ API Limit Reached";
    }
    else if(error.message.includes("500")){
        message = "⚠️ Server Error";
    }
    else{
        message = "🌐 Check Your Internet Connection";
    }

    document.getElementById("result").innerHTML=`
        <div class="error-card">
            <i class="fa-solid fa-circle-exclamation"></i>
            <h3>${message}</h3>
            <p>Please try again.</p>
        </div>
    `;

    showToast(message);

}

}

function saveHistory(song){

    let history = JSON.parse(localStorage.getItem("songs")) || [];

    history.unshift(song);

    if(history.length > 5){
        history.pop();
    }

    localStorage.setItem("songs", JSON.stringify(history));

    loadHistory();

}

function loadHistory(){

    let history = JSON.parse(localStorage.getItem("songs")) || [];

    let list = document.getElementById("historyList");

    list.innerHTML = "";

    if(history.length===0){

        list.innerHTML = `

        <div class="empty">

            <i class="fa-solid fa-music"></i>

            <h3>No Downloads Yet</h3>

            <p>Download your first song</p>

        </div>

        `;

        document.getElementById("historyCount").innerHTML = 0;

        return;

    }

    history.forEach(song=>{

    list.innerHTML += `

    <li class="history-card">

        <img src="${song.cover}">

        <div>

            <h4>${song.title}</h4>

            <p>${song.artist}</p>

            <small>🕒 ${song.time}</small>

        </div>

    </li>

    `;

});

document.getElementById("historyCount").innerHTML = history.length;
}


function showToast(message){

    const toast = document.getElementById("toast");
    const text = document.getElementById("toastText");

    text.innerHTML = message;

    toast.classList.add("show");

    setTimeout(function(){

        toast.classList.remove("show");

    },3000);

}

window.onload=function(){

    loadHistory();
    loadCounter();

    if(localStorage.getItem("theme")=="light"){

        document.body.classList.add("light");

        document.getElementById("themeIcon").className="fa-solid fa-sun";

    }

};

function updateCounter(){

    let count = localStorage.getItem("downloads") || 0;

    count++;

    localStorage.setItem("downloads",count);

    document.getElementById("downloadCount").innerHTML=count;

}

function loadCounter(){

    let count = localStorage.getItem("downloads") || 0;

    document.getElementById("downloadCount").innerHTML = count;

    document.getElementById("downloadCountCard").innerHTML = count;

}

function clearHistory(){

    localStorage.removeItem("songs");

    loadHistory();

    showToast("History Cleared");

}

function copyLink(){

    let link=document.getElementById("songLink").value;

    navigator.clipboard.writeText(link);

    showToast("Spotify Link Copied");

}

function toggleTheme(){

    document.body.classList.toggle("light");

    const icon=document.getElementById("themeIcon");

    if(document.body.classList.contains("light")){

        icon.className="fa-solid fa-sun";

        localStorage.setItem("theme","light");

    }

    else{

        icon.className="fa-solid fa-moon";

        localStorage.setItem("theme","dark");

    }

}

document.getElementById("songLink").addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        downloadSong();

    }

});