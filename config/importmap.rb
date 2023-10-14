# Pin npm packages by running ./bin/importmap

pin_all_from File.expand_path("../app/javascript", __dir__)
pin "application", preload: true

pin "popper", to: 'popper.js', preload: true
pin "bootstrap", to: 'bootstrap.min.js', preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@github/webauthn-json", to: "https://ga.jspm.io/npm:@github/webauthn-json@2.1.1/dist/esm/webauthn-json.js"
