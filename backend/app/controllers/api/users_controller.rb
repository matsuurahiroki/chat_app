# app/controllers/api/users_controller.rb
class Api::UsersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :verify_bff_token!

  def destroy
    user = current_user
    if user.nil?
      uid = request.headers["X-User-Id"].to_s
      return head :bad_request if uid.blank?
      user = User.find_by(id: uid)
    end
    return head :not_found unless user

    user.destroy!
    reset_session
    head :no_content
  end

  private
  def verify_bff_token!
    expected = ENV["BFF_SHARED_TOKEN"].to_s
    provided = request.headers["X-BFF-Token"].to_s
    head :unauthorized unless expected.present? &&
      ActiveSupport::SecurityUtils.secure_compare(expected, provided)
  end
end
