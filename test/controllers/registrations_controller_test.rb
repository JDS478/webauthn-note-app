# frozen_string_literal: true

require 'test_helper'

class RegistrationsControllerTest < ActionController::TestCase
  test 'should get registration index' do
    get :index

    assert_response :success
  end

  test 'should get login view' do
    get :cred_login

    assert_response :success
  end

  test 'should create new user and redirect' do
    assert_difference('User.count') do
      post :create, params: { user: { username: 'NewUser123' } }
    end

    assert_redirected_to '/dashboard'
    assert_equal('NewUser123', User.last.username)
  end
end
