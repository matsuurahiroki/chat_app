# frozen_string_literal: true

module JwtHelpers
  def jwt_headers(user, headers = { 'Accept' => 'application/json' })
    Devise::JWT::TestHelpers.auth_headers(headers, user)
  end
end

RSpec.configure do |config|
  config.include JwtHelpers, type: :request
end
