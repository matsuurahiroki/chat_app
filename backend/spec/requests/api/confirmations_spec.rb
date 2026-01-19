# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Confirmations API', type: :request do
  it 'GET /api/confirm token無しは 400/422' do
    get '/api/confirm', as: :json
    expect([400, 422]).to include(response.status)
  end

  it 'POST /api/confirm/resend email無しは 400/422' do
    post '/api/confirm/resend', params: {}, as: :json
    expect([400, 422]).to include(response.status)
  end
end
