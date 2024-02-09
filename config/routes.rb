Rails.application.routes.draw do
  root 'dashboard#index'

  resources :registrations, only: %i[index create] do
    collection do
      get :cred_login
      post :user_callback
      post :cred_callback
    end
  end

  resources :notes, except: :index

  resources :dashboard, only: %i[index destroy] do
    collection do
      get :credentials
      get :cred_options
      post :callback
    end
  end

  delete 'signout', to: 'dashboard#signout'
end
