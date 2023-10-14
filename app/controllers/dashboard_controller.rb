# frozen_string_literal: true

class DashboardController < ApplicationController
  layout 'dash'

  def index; end

  def credentials; end

  def cred_options; end

  def callback; end

  def signout
    cookies.delete :signin_token

    redirect_to registrations_path
  end
end
