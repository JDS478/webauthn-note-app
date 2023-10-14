import * as WebAuthn from "@github/webauthn-json"

export default () => {
  function getCSRFToken() {
    const CSRFSelector = document.querySelector('meta[name="csrf-token"]')
    if (CSRFSelector) {
      return CSRFSelector.getAttribute("content")
    } else {
      return null
    }
  }

  const callback = (url, body) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-Token": getCSRFToken()
      },
      credentials: 'same-origin'
    }).then(function(response) {
      if (response.ok) {
        window.location.replace("/")
      } else if (response.status < 500) {
        response.text().then(showMessage);
      } else {
        showMessage("Sorry, something wrong happened.");
      }
    });
  }

  const create = (callbackUrl, credentialOptions) => {
    WebAuthn.create({ "publicKey": credentialOptions }).then(function(credential) {
      callback(callbackUrl, credential);
    }).catch(function(error) {
      showMessage(error);
    });

    console.log("Creating new public key credential...");
  }

  const get = (credentialOptions) => {
    WebAuthn.get({ "publicKey": credentialOptions }).then(function(credential) {
      callback("/session/callback", credential);
    }).catch(function(error) {
      console.log('get credential issue')
      showMessage(error);
    });

    console.log("Getting public key credential...");
  }
}
