# app/controllers/api/auth/sessions_controller.rb
class Api::Auth::SessionsController < ApplicationController
  protect_from_forgery with: :exception

  def create
    user = User.find_by(email: params[:email])
    if user&.valid_password?(params[:password])
      reset_session
      sign_in(user)
      head :no_content
    else
      head :unauthorized
    end
  end

  def destroy
    reset_session
    sign_out(current_user) if current_user
    head :no_content
  end
end
