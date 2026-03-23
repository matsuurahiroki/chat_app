# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'User Resource API', type: :request do
  let(:password) { 'password123' }
  let(:user) { create_confirmed_user(password:) }

  let(:headers) do
    {
      'X-BFF-Token' => ENV.fetch('BFF_SHARED_TOKEN'),
      'Accept' => 'application/json',
      'X-User-Id' => user.id.to_s
    }
  end

  it 'DELETE /api/user 現在のパスワードが正しければ 200' do
    sign_in user

    delete '/api/user',
           params: { current_password: password },
           headers: headers,
           as: :json

    expect(response.status).to eq(200)
  end
end
