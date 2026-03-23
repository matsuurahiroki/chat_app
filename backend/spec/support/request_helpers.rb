# frozen_string_literal: true

require 'securerandom'

module RequestHelpers
  def json_headers(extra = {})
    {
      'ACCEPT' => 'application/json',
      'CONTENT_TYPE' => 'application/json',
      'X-BFF-Token' => ENV.fetch('BFF_SHARED_TOKEN')
    }.merge(extra)
  end
end

def create_confirmed_user(password: 'Password1234')
  user = User.new(
    name: 'TestUser',
    email: ['test-', SecureRandom.hex(6), '@example.com'].join,
    password: password,
    password_confirmation: password
  )
  # confirmable有り/無しの両対応
  user.skip_confirmation! if user.respond_to?(:skip_confirmation!)
  user.confirmed_at = Time.current if user.respond_to?(:confirmed_at=) && user.confirmed_at.nil?

  user.save || raise("User invalid: #{user.errors.full_messages.join(', ')}")
  user
end

RSpec.configure do |config|
  config.include RequestHelpers, type: :request
end
