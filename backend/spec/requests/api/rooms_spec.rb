# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Rooms API', type: :request do
  describe 'GET /api/rooms' do
    it '未ログインは 401/403' do
      get '/api/rooms', as: :json
      expect([401, 403]).to include(response.status)
    end

    context 'ログイン済み' do
      let(:user) { create_confirmed_user }
      let(:headers) do
        {
          'X-BFF-Token' => ENV.fetch('BFF_SHARED_TOKEN'),
          'Accept' => 'application/json',
          'X-User-Id' => user.id.to_s
        }
      end
      it '200' do
        get '/api/rooms', headers: headers, as: :json
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'POST /api/rooms' do
    context 'ログイン済み' do
      let(:user) { create_confirmed_user }
      let(:headers) do
        {
          'X-BFF-Token' => ENV.fetch('BFF_SHARED_TOKEN'),
          'Accept' => 'application/json',
          'X-User-Id' => user.id.to_s
        }
      end
      it '作成成功は 200/201' do
        post '/api/rooms', params: { title: 'hello', user_id: user.id }, headers: headers, as: :json
        expect([200, 201]).to include(response.status)
        puts user.id
      end
    end
  end
end
