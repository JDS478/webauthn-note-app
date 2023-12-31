import * as WebAuthn from "@github/webauthn-json"

export default () => {
  const getCSRFToken = () => {
    const CSRFSelector = document.querySelector('meta[name="csrf-token"]')
    if (CSRFSelector) {
      return CSRFSelector.getAttribute("content")
    } else {
      return null
    }
  }

  const get = (credentialOptions) => {
    WebAuthn.get({ "publicKey": credentialOptions }).then(function(credential) {
      callback("/registrations/cred_callback", credential);
    }).catch(function(error) {
      console.error(error);
    });

    console.log("Getting public key credential...");
  }

  const getLoginOptions = async (username) => {
    const userUrl = '/registrations/user_callback';
    const data = {user: username};

    try {
      const response = await fetch(userUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        errorBox.innerHTML = "<p class='text-danger'>No user found!</p>"
        console.log("No user found!");
        return;
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      return;
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
        console.log(response.text());
      } else {
        console.log("Sorry, something wrong happened.");
      }
    });
  }


  if (document.getElementById('cred-login-btn')) {
    document.querySelector('#cred-login-btn').addEventListener('click', async () => {
      const errorBox = document.querySelector('#errors-box');
      const username = document.querySelector('#username-input').value;

      if (username === '') {
        errorBox.innerHTML = "<p class='text-danger'>No Username given!</p>"
        return console.error('No Username given!')
      }

      const userOptions = await getLoginOptions(username);
      if (userOptions.error) {
        errorBox.innerHTML = "<p class='text-danger'>No user found or error with credential retrieval!</p>"
        console.log('Error with options retrieval');
        return;
      } else {
        get(userOptions);
      }
    })
  }
}
