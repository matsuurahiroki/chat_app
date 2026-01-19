# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Auth Logout API', type: :request do
  let(:user) { create_confirmed_user }

  it 'DELETE /api/auth/logout ログイン済みは 200/204' do
    sign_in user
    delete '/api/auth/logout', as: :json
    expect([200, 204]).to include(response.status)
  end
end
