// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails

import "@hotwired/turbo-rails";
import "popper";
import "bootstrap";

import credential from 'packs/credential';
import credentialLogin from 'packs/credential_login';
import passkeys from 'packs/passkeys';
import passkeyLogins from 'packs/passkey_logins';

document.addEventListener("turbo:load", () => {
  // credential();
  // credentialLogin();
  passkeys();
  // passkeyLogins();
});
