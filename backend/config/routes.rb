Rails.application.routes.draw do
  namespace :api do
    namespace :auth do
      namespace :social do
        post 'login/google', to: 'google_logins#create'
      end
    end
  end
end
