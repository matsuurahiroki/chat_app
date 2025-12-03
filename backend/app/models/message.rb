# frozen_string_literal: true

# app/models/message.rb

class Message < ApplicationRecord
  belongs_to :room
  belongs_to :user

  validates :body,
            presence: true,
            length: { minimum: 1, maximum: 500 }
  validate :body_not_blank_like

  private

  def body_not_blank_like
    return if body.blank?

    return unless body.strip.empty?

    errors.add(:body, 'は空白以外の文字を入力してください')
  end
end
