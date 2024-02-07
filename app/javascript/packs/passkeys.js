// TODO: Add an ability to create a passkey: Create the registerCredential() function.
async function registerCredential() {

  // TODO: Add an ability to create a passkey: Obtain the challenge and other options from server endpoint.
  const options = await _fetch('/dashboard/cred_options');

  // TODO: Add an ability to create a passkey: Create a credential.
  // Base64URL decode some values.

  options.user.id = base64url.decode(options.user.id);
  options.challenge = base64url.decode(options.challenge);

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

  return await _fetch('/dashboard/callback', credential);
};

export default () => {
  const btn = document.querySelector('#credential-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      registerCredential();
    })
  }
}
