# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Messages API', type: :request do
  let(:user) { create_confirmed_user }
  let(:room) { Room.create!(title: 'room', user: user) }
  let(:headers) do
    {
      'X-BFF-Token' => ENV.fetch('BFF_SHARED_TOKEN'),
      'X-User-Id' => user.id.to_s,
      'Accept' => 'application/json'
    }
  end

  it 'POST /api/rooms/:room_id/messages 作成成功は 200/201' do
    sign_in user
    post "/api/rooms/#{room.id}/messages", params: { user_id: user.id, body: 'おすおすw' }, headers: headers, as: :json
    expect([200, 201]).to include(response.status)
  end
end
