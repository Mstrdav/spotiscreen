var stateKey = "spotify_auth_state";

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

var params = getHashParams();

var access_token = params.access_token,
  state = params.state,
  storedState = localStorage.getItem(stateKey);

if (access_token && (state == null || state !== storedState)) {
  alert("There was an error during the authentication");
} else {
  localStorage.removeItem(stateKey);
  if (access_token) {
    console.log("access_token: " + access_token);

    //  -----------------------------------------

    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + access_token
      }
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
      document.getElementById("spotify").style.display = "none";
    });

    // get most listened to artists
    fetch("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10", {
      headers: {
        Authorization: "Bearer " + access_token
      }
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);
      var artists = document.getElementById("artists");
      for (var i = 0; i < data.items.length; i++) {
        artists.innerHTML += data.items[i].name + "<br>";
      }
    });

    //  -----------------------------------------
  } else {
    console.log("no access_token: " + access_token);
  }

  document.getElementById("spotify").addEventListener(
    "click",
    () => {
      var client_id = "cc490f57e4334c1b8636efb4f2206ed8"; // Your client id
      var redirect_uri = "https://mstrdav.github.io/spotiscreen/"; // Your redirect uri

      var state = generateRandomString(16);

      localStorage.setItem(stateKey, state);
      var scope = "user-read-private user-top-read";

      var url = "https://accounts.spotify.com/authorize";
      url += "?response_type=token";
      url += "&client_id=" + encodeURIComponent(client_id);
      url += "&scope=" + encodeURIComponent(scope);
      url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
      url += "&state=" + encodeURIComponent(state);

      window.location = url;
    },
    false
  );
}
