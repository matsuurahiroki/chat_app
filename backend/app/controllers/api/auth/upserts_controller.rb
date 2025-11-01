# app/controllers/api/auth/upserts_controller.rb
class Api::Auth::UpsertsController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :verify_bff_token!

  def create
    p = params.permit(:provider, :providerSub, :email, :name)
    provider = p[:provider].to_s
    uid = p[:providerSub].to_s
    email = p[:email].presence
    name  = p[:name].presence || "ユーザー"

    return render json: { error: "bad_request" }, status: :bad_request if provider.blank? || uid.blank?

    if (idn = Identity.includes(:user).find_by(provider:, uid:))
      return render json: { railsUserId: idn.user_id }, status: :ok
    end

    user =
      if email && (u = User.find_by(email: email))
        u
      else
        # Devise(validatable)はパスワード必須 → ランダム付与
        pwd = SecureRandom.base58(16)
        User.create!(name:, email: (email || "oauth-#{provider}-#{uid}@example.invalid"), password: pwd)
      end

    Identity.create!(user:, provider:, uid:)
    render json: { railsUserId: user.id }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: "validation_error", details: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  private
  def verify_bff_token!
    expected = ENV["BFF_SHARED_TOKEN"].to_s
    provided = request.headers["X-BFF-Token"].to_s
    head :unauthorized unless expected.present? && ActiveSupport::SecurityUtils.secure_compare(expected, provided)
  end
end
