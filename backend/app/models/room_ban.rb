# app/models/room_ban.rb
# frozen_string_literal: true

class RoomBan < ApplicationRecord
  belongs_to :room
  belongs_to :user

  validates :user_id, uniqueness: { scope: :room_id }
end
