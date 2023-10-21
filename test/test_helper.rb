# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    def select_user_session
      user = users(:someuser)
      user.update!(webauthn_id: WebAuthn.generate_user_id)

      cookies = ActionDispatch::Cookies::CookieJar.build(@request, {})

      cookies.signed[:signin_token] = user.id
      @request.cookies['signin_token'] = cookies[:signin_token]

      assert_signed_in(user)
    end

    def assert_signed_in(user)
      jar = ActionDispatch::Cookies::CookieJar.build(@request, cookies.to_hash)

      id = jar.signed[:signin_token]
      assert_equal(user.id, id)
    end
  end
end
