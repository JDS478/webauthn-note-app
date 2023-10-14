Rails.application.routes.draw do
  root 'dashboard#index'

  resources :registrations, only: %i[index create] do
    collection do
      :cred_login
    end
  end

  resources :notes, except: :index

  resources :dashboard, only: %i[index] do
    collection do
      post :callback
    end
  end
end
