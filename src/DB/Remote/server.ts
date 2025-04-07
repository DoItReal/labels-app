export let address = "http://localhost:80/";

if (window.location.hostname !== "localhost") {
   address = "https://api.ez-labels.com/";
}
