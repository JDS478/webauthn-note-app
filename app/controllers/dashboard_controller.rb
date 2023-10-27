# frozen_string_literal: true

class DashboardController < ApplicationController
  layout 'dash'

  before_action :credential_check, only: %i[destroy signout]

  def index; end

  def credentials
    @credentials = @current_user.credentials
  end

  def cred_options
    # Credential/PassKey options
    create_options = WebAuthn::Credential.options_for_create(
      user: {
        id: @current_user.webauthn_id,
        name: @current_user.username
      },
      exclude: @current_user.credentials.pluck(:external_id),
      authenticator_selection: { user_verification: 'required' }
    )

    # Store challenge for verification
    session[:challenge] = create_options.challenge

    respond_to do |format|
      format.json { render json: create_options }
    end
  end

  def callback
    webauthn_credential = WebAuthn::Credential.from_create(params)

    begin
      webauthn_credential.verify(session[:challenge], user_verification: true)

      credential = @current_user.credentials.build(
        external_id: Base64.strict_encode64(webauthn_credential.raw_id),
        nickname: "created_#{Time.now.strftime('%d_%m_%y')}",
        public_key: webauthn_credential.public_key,
        sign_count: webauthn_credential.sign_count
      )

      if credential.save
        render json: { status: 'ok' }, status: :ok
      else
        render json: "Couldn't register your PassKey", status: :unprocessable_entity
      end
    rescue WebAuthn::Error => e
      render json: "Verification failed: #{e.message}", status: :unprocessable_entity
    ensure
      session.delete :challenge
    end
  end

  def destroy
    @credential = Credential.find(params[:id])
    @credential.delete

    redirect_to credentials_dashboard_index_path
  end

  def signout
    cookies.delete :signin_token

    redirect_to registrations_path
  end

  private

  def credential_check
    return if @current_user.credentials.count >= 1

    flash[:notice] = 'You need at least one passkey!'
    redirect_to credentials_dashboard_index_path
  end
end
