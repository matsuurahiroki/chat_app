# frozen_string_literal: true

# app/models/room.rb

class Room < ApplicationRecord
  belongs_to :user # 作成主（オーナー）
  has_many :messages, dependent: :destroy
  has_many :room_bans, dependent: :destroy
  has_many :banned_users, through: :room_bans, source: :user

  def created_at_text
    created_at.in_time_zone('Asia/Tokyo').strftime('%Y/%m/%d %H:%M')
  end

  validates :title, presence: true
end

#  belongs_toは1つのモデルと関連付ける(その親1件に属する宣言)
