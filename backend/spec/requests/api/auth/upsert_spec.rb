# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Auth Upsert API', type: :request do
  let(:headers) do
    {
      'X-BFF-Token' => ENV.fetch('BFF_SHARED_TOKEN'),
      'Accept' => 'application/json'
    }
  end

  let(:user) { create_confirmed_user }
  before { sign_in user }
  it 'POST /api/auth/upsert パラメータ不足は 400/422' do
    post '/api/auth/upsert', params: {}, headers: headers, as: :json
    expect([400, 422]).to include(response.status)
  end
end
