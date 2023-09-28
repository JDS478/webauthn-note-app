# frozen_string_literal: true

class Credential < ApplicationRecord
  belongs_to :user
end
