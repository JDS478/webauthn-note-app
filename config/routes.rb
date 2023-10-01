Rails.application.routes.draw do
  resources :registrations, only: %i[index create]

  resources :dashboard, only: %i[index] do
    collection do
      post :callback
    end
  end
end
