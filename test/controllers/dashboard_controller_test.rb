# frozen_string_literal: true

require 'test_helper'

class DashboardControllerTest < ActionController::TestCase
  setup do
    select_user_session
  end

  test 'should get dashboard index' do
    get :index

    assert_response :success
  end
end
