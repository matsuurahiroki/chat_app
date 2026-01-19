# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'User Resource API', type: :request do
  let(:user) { create_confirmed_user }
  let(:headers) do
    {
      'X-BFF-Token' => ENV.fetch('BFF_SHARED_TOKEN'),
      'Accept' => 'application/json',
      'X-User-Id' => user.id.to_s
    }
  end

  it 'DELETE /api/user ログイン済みは 200/204' do
    sign_in user
    delete '/api/user', headers: headers, as: :json
    expect([200, 204]).to include(response.status)
  end
end
