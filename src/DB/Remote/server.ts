export let address = "http://localhost:80/";

if (window.location.hostname !== "localhost") {
   // address = "https://labelsservice-edkh1hja.b4a.run/";
   address = "https://api.ez-labels.com/";
}
