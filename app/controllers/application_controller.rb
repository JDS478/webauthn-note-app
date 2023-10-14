# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # before_action :set_user

  def set_user
    @current_user = User.find_by(id: cookies.signed[:signin_token])

    redirect_to registrations_path if @current_user.blank?
  end
end
