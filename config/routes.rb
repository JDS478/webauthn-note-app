Rails.application.routes.draw do
  root 'dashboard#index'

  resources :registrations, only: %i[index create] do
    collection do
      post :cred_login
    end
  end

  resources :notes, except: :index

  resources :dashboard, only: :index do
    collection do
      post :callback
    end
  end

  delete 'signout', to: 'dashboard#signout'
end
