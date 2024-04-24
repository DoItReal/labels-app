export let address = "http://localhost:8080/";

if (window.location.hostname !== "localhost") {
    address = "https://labelsservice-edkh1hja.b4a.run/";
}
