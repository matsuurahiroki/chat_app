# frozen_string_literal: true

# backend/config/routes.rb

Rails.application.routes.draw do
  get '/health', to: proc { [200, { 'Content-Type' => 'text/plain' }, ['ok']] }

  devise_for :users, defaults: { format: :json } # 既存
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?

  namespace :api do
    get  'confirm',        to: 'confirmations#show'
    post 'confirm/resend', to: 'confirmations#resend'
    resource :user, only: [:destroy] # => DELETE /api/user resourcesは複数形ではなく単数形
    resources :users, only: [:update]
    resources :rooms, only: %i[index create show destroy] do
      resources :messages, only: %i[index create show update destroy]
    end
    namespace :auth do
      post :signup, to: 'registrations#create'   # 自前SignUp(API)
      post :login,  to: 'sessions#create'        # 自前Login(API)
      delete :logout, to: 'sessions#destroy'     # 自前Logout(API)
      post :upsert, to: 'upserts#create'         # OAuth upsert(API)
    end
  end
end

# 各要素の意味（Railsの文脈）
# Railsの resources などでよく使い、「許可するアクション（メソッド名）」を列挙します。
# index：一覧（例：GET /api/rooms）
# create：作成（例：POST /api/rooms）
# show：詳細（例：GET /api/rooms/:id）
# update：更新（例：PATCH /api/rooms/:id）
