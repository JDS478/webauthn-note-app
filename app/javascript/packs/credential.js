import * as WebAuthn from "@github/webauthn-json"

export default () => {
  // Get CSRF token to allow requests
  const getCSRFToken = () => {
    const CSRFSelector = document.querySelector('meta[name="csrf-token"]')
    if (CSRFSelector) {
      return CSRFSelector.getAttribute("content")
    } else {
      return null
    }
  }

  // Retrieve relevant JSON for creation
  const getUserOptions = async () => {
    try {
      const response = await fetch('/dashboard/cred_options', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": getCSRFToken()
        },
        credentials: 'same-origin'
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("Error retrieving options");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  // Once created re-direct
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
        window.location.replace("/dashboard/credentials")
      } else if (response.status < 500) {
        console.log(response.text());
      } else {
        console.log("Sorry, something wrong happened.");
      }
    });
  }

  const create = (callbackUrl, credentialOptions) => {
    WebAuthn.create({ "publicKey": credentialOptions }).then(function(credential) {
      callback(callbackUrl, credential);
    }).catch(function(error) {
      console.log(error);
    });

    console.log("Creating new public key credential...");
  }

  if (document.getElementById('credential-btn')) {
    document.querySelector('#credential-btn').addEventListener('click', async () => {
      const userOptions = await getUserOptions();
      const callbackUrl = '/dashboard/callback';

      create(callbackUrl, userOptions);
    })
  }
}
