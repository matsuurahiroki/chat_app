class Api::Auth::RegistrationsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    user = User.new(params.permit(:name, :email, :password))
    if user.save
      render json: { ok: true, user: { id: user.id, name: user.name, email: user.email } }, status: :created
    else
      render json: { ok: false, errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
