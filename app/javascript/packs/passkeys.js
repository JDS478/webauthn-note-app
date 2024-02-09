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

// TODO: Add an ability to create a passkey: Create the registerCredential() function.
async function registerCredential() {

  // TODO: Add an ability to create a passkey: Obtain the challenge and other options from server endpoint.
  const options = await _fetch('/dashboard/cred_options');
  console.log(options)

  // TODO: Add an ability to create a passkey: Create a credential.
  // Base64URL decode some values.

  options.user.id = base64url.decode(options.user.id);
  options.challenge = base64url.decode(options.challenge);
  console.log(options)
  if (options.excludeCredentials) {
    for (let cred of options.excludeCredentials) {
      cred.id = base64url.decode(cred.id);
    }
  }

  // Use platform authenticator and discoverable credential.
  options.authenticatorSelection = {
    authenticatorAttachment: 'platform',
    requireResidentKey: true
  }

  // Invoke the WebAuthn create() method.
  const cred = await navigator.credentials.create({
    publicKey: options,
  });

  // TODO: Add an ability to create a passkey: Register the credential to the server endpoint.
  const credential = {};
  credential.id = cred.id;
  credential.rawId = cred.id; // Pass a Base64URL encoded ID string.
  credential.type = cred.type;

  // The authenticatorAttachment string in the PublicKeyCredential object is a new addition in WebAuthn L3.
  if (cred.authenticatorAttachment) {
    credential.authenticatorAttachment = cred.authenticatorAttachment;
  }

  // Base64URL encode some values.
  const clientDataJSON = base64url.encode(cred.response.clientDataJSON);
  const attestationObject =
  base64url.encode(cred.response.attestationObject);

  // Obtain transports.
  const transports = cred.response.getTransports ?
  cred.response.getTransports() : [];

  credential.response = {
    clientDataJSON,
    attestationObject,
    transports
  };

  const resp = await _fetch('/dashboard/callback', credential);

  if (resp.ok) {
    window.location.replace('/')
  } else {
    console.log('Verification error!')
  }
};

export default () => {
  const btn = document.querySelector('#credential-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      registerCredential();
    })
  }
}
