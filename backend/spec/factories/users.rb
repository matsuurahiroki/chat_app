# spec/factories/users.rb

# テスト用レコードの作り方（デフォルト値）を定義

FactoryBot.define do
  factory :user do
    sequence(:email) { ['test-', SecureRandom.hex(6), '@example.com'].join }
    password { 'Password1234' }
    confirmed_at { Time.current }
    name { 'TestUser' }
  end
end
