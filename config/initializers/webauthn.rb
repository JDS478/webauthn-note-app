WebAuthn.configure do |config|
  # This value needs to match `window.location.origin` evaluated by
  # the User Agent during registration and authentication ceremonies.
  config.origin = 'http://localhost:3000'

  # Relying Party name for display purposes
  config.rp_name = "MyNoteApp"
end
