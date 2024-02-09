const getCSRFToken = () => {
  const CSRFSelector = document.querySelector('meta[name="csrf-token"]')
  if (CSRFSelector) {
    return CSRFSelector.getAttribute("content")
  } else {
    return null
  }
}

const base64url = {
  encode: function(buffer) {
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  },
  decode: function(base64url) {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const binStr = window.atob(base64);
    const bin = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bin[i] = binStr.charCodeAt(i);
    }
    return bin.buffer;
  }
}


async function _fetch(path, payload = '') {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    "X-CSRF-Token": getCSRFToken()
  };
  if (payload && !(payload instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(payload);
  }
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers,
    body: payload,
  });
  if (res.status === 200) {
    // Server authentication succeeded
    return res.json();
  } else {
    // Server authentication failed
    const result = await res.json();
    throw new Error(result.error);
  }
};

// TODO: Add an ability to authenticate with a passkey: Create the authenticate() function.
export async function authenticate() {

  // TODO: Add an ability to authenticate with a passkey: Obtain the
  // challenge and other options from the server endpoint.
  const options = await _fetch('/registrations/user_callback');

  // TODO: Add an ability to authenticate with a passkey: Locally verify
  // the user and get a credential.
  // Base64URL decode the challenge.
  options.challenge = base64url.decode(options.challenge);

  // The empty allowCredentials array invokes an account selector
  options.allowCredentials = [];

  // Invoke the WebAuthn get() function.
  const cred = await navigator.credentials.get({
    publicKey: options,
    // Request a conditional UI.
    mediation: 'conditional'
  });

  // TODO: Add an ability to authenticate with a passkey: Verify the credential.
  const credential = {};
  credential.id = cred.id;
  credential.rawId = cred.id; // Pass a Base64URL encoded ID string.
  credential.type = cred.type;

  // Base64URL encode some values.
  const clientDataJSON = base64url.encode(cred.response.clientDataJSON);
  const authenticatorData = base64url.encode(cred.response.authenticatorData);
  const signature = base64url.encode(cred.response.signature);
  const userHandle = base64url.encode(cred.response.userHandle);

  credential.response = {
    clientDataJSON,
    authenticatorData,
    signature,
    userHandle,
  };

  return await _fetch(`/registrations/cred_callback`, credential);
};

const conditional = async () => {
  if (
    window.PublicKeyCredential
      && PublicKeyCredential.isConditionalMediationAvailable
  ) {
    try {
      // Is conditional UI available in this browser?
      const cma = await PublicKeyCredential.isConditionalMediationAvailable();
      if (cma) {
        console.log('cma possible')
        // If conditional UI is available, invoke the authenticate() function.
        const user = await authenticate();
        if (user.ok) {
          // Proceed only when authentication succeeds.
          document.querySelector('#username-input').value = user.username;
          location.href = '/';
        } else {
          throw new Error('User not found.');
        }
      }
    } catch (e) {
      if (e.name !== 'NotAllowedError') {
        console.error(e);
      }
    }
  }
};

export default () => {
  const element = document.querySelector('#username-input');
  if (element) {
    conditional();
  }
}
