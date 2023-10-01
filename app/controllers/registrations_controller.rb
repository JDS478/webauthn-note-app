# frozen_string_literal: true

class RegistrationsController < ApplicationController
  def index
    @user = User.new
  end

  def create
    # raise
    @user = User.new(user_params)
    # TODO: Setup credential creation

    if @user.save
      login_user(@user)

      # Render a json with webauth options
      # redirect_to dashboard_path
    else
      flash[:error] = @user.errors.full_messages.uniq

      redirect_to registrations_path
    end
  end

  private

  def login_user(user)
    cookies.signed[:sign_in_token] = user.id
  end

  def user_params
    params.require(:user).permit(:username)
  end
end
