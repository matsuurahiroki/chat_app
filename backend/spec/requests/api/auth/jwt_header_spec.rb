RSpec.describe 'JWT header', type: :request do
  let(:email) { "test-#{SecureRandom.hex(4)}@example.com" }
  let(:password) { 'password1234' }

  let!(:user) do
    User.create!(
      name: 'test_user',
      email: email,
      password: password,
      confirmed_at: Time.current
    )
  end

  it 'Devise::JWT::TestHelpersでAuthorizationヘッダを作って認証必須APIを叩ける' do
    headers = Devise::JWT::TestHelpers.auth_headers(json_headers, user)

    # ↓ ここを「authenticate_user! が付いてる API」に差し替えてください
    get '/api/rooms', headers: headers

    expect(response).to have_http_status(:ok)
  end
end
