# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Auth Signup API', type: :request do
  it 'POST /api/auth/signup 成功は 200/201' do
    post '/api/auth/signup',
         params: { name: 'TestUser', email: "test-#{SecureRandom.hex(4)}@example.com", password: 'Password1234', password_confirmation: 'Password1234' },
         as: :json
    expect([200, 201]).to include(response.status)
  end
end
