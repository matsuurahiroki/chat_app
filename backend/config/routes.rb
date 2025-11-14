# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json } # 既存
  namespace :api do
    resource :user, only: [:destroy] # => DELETE /api/user resourceは
    namespace :auth do
      post :signup, to: 'registrations#create'   # 自前SignUp(API)
      post :login,  to: 'sessions#create'        # 自前Login(API)
      delete :logout, to: 'sessions#destroy'     # 自前Logout(API)
      post :upsert, to: 'upserts#create'         # OAuth upsert(API)
    end
  end
end
