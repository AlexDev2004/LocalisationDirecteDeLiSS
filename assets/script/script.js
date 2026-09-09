/***************
  MAP LEAFLET
***************/

// ---------------- Ajouter la carte --------------------------
const map = L.map('map').setView([0, 0], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ---------------- Ajouter le marker ----------------------------------
const ISS_ICON = L.icon({
    iconUrl: 'assets/img/international-space-station-icon.png',
    iconSize:     [50,50], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
});

const MARKER = L.marker([0,0],{icon: ISS_ICON}).addTo(map);


/*******************
  SUIVI ISS
*******************/

// ---- Fonction qui récupère les coordonnées de l'iss et change la position de la carte et du marker -----
async function  issAPI(map,marker) {
  try{
    const response = await fetch("http://api.open-notify.org/iss-now.json");
    const issStat = await response.json();
    const issPos = issStat.iss_position;

    map.setView([issPos.latitude,issPos.longitude]);
    marker.setLatLng([issPos.latitude,issPos.longitude]);
  }catch(erreur){
    alert("Une erreur est survenue : "+erreur);
  }
}

// ---------------- Appeler la fonction toutes les secondes ----------------------------------------
setInterval(()=>{
  issAPI(map,MARKER);
}, 1000);


/***************
  METEO LOCALE
***************/

// --------- Placer un paragraphe dans l'onglet météo et lui donner le style demandé ------

const cardMeteo = document.querySelector(".cardMeteo");
const bouton = cardMeteo.querySelector("button");

const blocMeteo = document.createElement("p");
blocMeteo.style.height = "300px";
blocMeteo.style.width = "200px";
blocMeteo.style.marginTop = "16px";
blocMeteo.style.marginBottom = "16px";
blocMeteo.style.border = "3px solid rgb(100,100,100)";
blocMeteo.style.paddingTop = "16px";
blocMeteo.style.paddingRight = "12px";
blocMeteo.style.paddingLeft = "12px";
blocMeteo.style.paddingBottom = "24px";
cardMeteo.appendChild(blocMeteo);
cardMeteo.appendChild(bouton);


// ------------- Fonction qui intègre un texte dans un paragraphe ----------------

function addInfo(htmlElement, txt){
  htmlElement.innerHTML = txt;
}

//---- Fonction qui au clic appelle la fonction addInfo et y injecte les données de météo --

bouton.addEventListener("click",async()=>{
  try{
    const response = await fetch("https://prevision-meteo.ch/services/json/toulouse");
    const meteo = await response.json();
    const condition = meteo.current_condition.condition;
    const temp = meteo.current_condition.tmp;
    const maxTemp = meteo.fcst_day_0.tmax;
    const minTemp = meteo.fcst_day_0.tmin;

    const text = `
    Condition actuelle : ${condition}, <br>
    Température actuelle : ${temp}°C, <br>
    Température maximale : ${maxTemp}°C, <br>
    Température minimale : ${minTemp}°C.
    `
    addInfo(blocMeteo,text);
  }catch(erreur){
    alert("Une erreur est survenue : "+erreur);
  }
});

