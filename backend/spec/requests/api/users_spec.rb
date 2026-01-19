# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Users API', type: :request do
  let(:user) { create_confirmed_user }
  let(:headers) do
    {
      'X-BFF-Token' => ENV.fetch('BFF_SHARED_TOKEN'),
      'Accept' => 'application/json',
      'X-User-Id' => user.id.to_s
    }
  end

  it 'PATCH /api/users/:id ログイン済みは 200/422' do
    sign_in user
    patch "/api/users/#{user.id}", params: { user: { name: 'test_user' } }, headers: headers, as: :json
    expect([200, 422]).to include(response.status)
  end
end
