# frozen_string_literal: true

class User < ApplicationRecord
  before_create :initialize_webauthn_id

  def initialize_webauthn_id
    # user.update!(webauthn_id: WebAuthn.generate_user_id)
    self.webauthn_id = WebAuthn.generate_user_id
  end
end