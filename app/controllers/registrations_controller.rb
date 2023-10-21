# frozen_string_literal: true

class RegistrationsController < ApplicationController
  skip_before_action :set_user

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

  def cred_login; end

  def user_callback
    user = User.find_by(username: params[:user] )

    return no_user_error unless user

    options = WebAuthn::Credential.options_for_get(
      allow: user.credentials.map { |cred| cred.external_id }
    )

    # Store challenge somewhere for verification and user id for lookup if successful
    session[:authentication_challenge] = {
      challenge: options.challenge,
      user: user.id
    }

    render json: options
  end

  def cred_callback
    webauthn_credential = WebAuthn::Credential.from_get(params)

    user = User.find(session[:authentication_challenge]['user'])
    credential = user.credentials.find_by(external_id:  Base64.strict_encode64(webauthn_credential.raw_id))

    begin
      webauthn_credential.verify(
        session[:authentication_challenge]['challenge'],
        public_key: credential.public_key,
        sign_count: credential.sign_count
      )

      credential.update!(sign_count: webauthn_credential.sign_count)

      login_user(user)
      logger.info "Logged in #{user.username}"

      render json: { status: "ok" }, status: :ok
    rescue WebAuthn::Error => e
      render json: "Verification failed: #{e.message}", status: :unprocessable_entity
      logger.warn "Verification error: #{e.message}"
    ensure
      session.delete('authentication_challenge')
    end
  end

  private

  def login_user(user)
    cookies.signed[:signin_token] = user.id
  end

  def user_params
    params.require(:user).permit(:username)
  end

  def no_user_error
    logger.warn 'No user found for given username'
    render json: { error: 'No User found' }
  end
end
