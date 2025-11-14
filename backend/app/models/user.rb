# frozen_string_literal: true

# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :identities, dependent: :destroy
end
