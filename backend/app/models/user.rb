# frozen_string_literal: true

# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :rememberable, :validatable
  has_many :identities, dependent: :destroy
  has_many :rooms, dependent: :destroy
  has_many :messages, dependent: :destroy

  validate :password_complexity

  private

  def password_complexity
    return if password.blank? # 未入力時（更新時など）はここでスキップ
    return if password =~ /\A(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}\z/

    errors.add(:password, 'は英字と数字をそれぞれ1文字以上含めてください')
  end
end

#  has_manyは複数のモデルを持てるようにする
#  dependent: :destroyは親レコードを何かした時に子レコードにも作用を施す(ependent: :destroyなら親レコードが削除されたら子レコードも削除される)
