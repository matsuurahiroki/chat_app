# spec/support/devise_jwt_test_helpers.rb
require 'devise/jwt/test_helpers'

module DeviseJwtTestHelpers
  def jwt_headers_for(user)
    Devise::JWT::TestHelpers.auth_headers({ 'Accept' => 'application/json' }, user)
  end
end

RSpec.configure do |config|
  config.include DeviseJwtTestHelpers, type: :request
end
