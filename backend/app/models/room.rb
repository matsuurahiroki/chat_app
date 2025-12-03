# frozen_string_literal: true

# app/models/room.rb

class Room < ApplicationRecord
  belongs_to :user
  has_many :messages, dependent: :destroy

  validates :title, presence: true
end
