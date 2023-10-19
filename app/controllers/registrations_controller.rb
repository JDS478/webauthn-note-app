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
    user = User.find_by(username: params[:username] )

    return no_user_error unless user

    options = WebAuthn::Credential.options_for_get(
      allow: user.credentials.map { |cred| cred.external_id }
    )
    # Store the newly generated challenge somewhere so you can have it
    # for the verification phase.
    session[:authentication_challenge] = options.challenge

    render json: options
  end

  def cred_callback
    # Assuming you're using @github/webauthn-json package to send the `PublicKeyCredential` object back
    # in params[:publicKeyCredential]:
    webauthn_credential = WebAuthn::Credential.from_get(params[:publicKeyCredential])

    credential = user.credentials.find_by(webauthn_id: webauthn_credential.id)

    begin
      webauthn_credential.verify(
        session[:authentication_challenge],
        public_key: credential.public_key,
        sign_count: credential.sign_count
      )

      # Update the stored credential sign count with the value from `webauthn_credential.sign_count`
      credential.update!(sign_count: webauthn_credential.sign_count)

      # Continue with successful sign in or 2FA verification...

    rescue WebAuthn::SignCountVerificationError => e
      # Cryptographic verification of the authenticator data succeeded, but the signature counter was less then or equal
      # to the stored value. This can have several reasons and depending on your risk tolerance you can choose to fail or
      # pass authentication. For more information see https://www.w3.org/TR/webauthn/#sign-counter
    rescue WebAuthn::Error => e
      # Handle error
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
