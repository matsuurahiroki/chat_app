# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Auth Login API', type: :request do
  let!(:user) { create_confirmed_user(password: 'Password1234') }
  # ↑ create_confirmed_userヘルパーでユーザー作成、create_confirmed_userはspec/support/request_helpers.rbに定義済み

  it 'POST /api/auth/login 成功は 200' do
    post '/api/auth/login', params: { email: user.email, password: 'Password1234' }, as: :json
    expect(response).to have_http_status(:ok)
  end
end
