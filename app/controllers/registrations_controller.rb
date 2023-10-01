# frozen_string_literal: true

class RegistrationsController < ApplicationController
  def index
    @user = User.new
  end

  def create
    raise
    @user = User.new(user_params)
  end

  private

  def user_params
    params.require(:user).permit(:username)
  end
end
