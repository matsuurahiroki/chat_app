# frozen_string_literal: true

# backend/spec/requests/api/auth/login_token_spec.rb

require 'rails_helper'

RSpec.describe 'Login token', type: :request do
  let(:email) { "test-#{SecureRandom.hex(6)}@example.com" }
  let(:password) { 'Password1234' }

  before do
    User.create!(
      name: 'TestUser',
      email: email,
      password: password,
      confirmed_at: Time.current
    )
  end

  it 'loginでJWTを取得できる' do
    post '/api/auth/login',
         params: { email: email, password: password },
         as: :json

    expect(response).to have_http_status(:ok)

    pp response.status
    pp response.headers['Authorization']
    pp response.body
  end
end
