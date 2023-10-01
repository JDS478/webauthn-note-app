# frozen_string_literal: true

class RegistrationsController < ApplicationController
  def index
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      login_user(@user)

      redirect_to dashboard_index_path
    else
      flash[:notice] = @user.errors.full_messages.uniq

      redirect_to registrations_path
    end
  end

  private

  def login_user(user)
    cookies.signed[:signin_token] = user.id
  end

  def user_params
    params.require(:user).permit(:username)
  end
end
