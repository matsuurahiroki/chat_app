# frozen_string_literal: true

# backend/app/controllers/api/confirmations_controller.rb

module Api
  class ConfirmationsController < ApplicationController
    protect_from_forgery with: :null_session

    def show
      token = params[:token].to_s
      user = User.confirm_by_token(token)

      if user.errors.empty?
        render json: { ok: true }, status: 200
      else
        render json: { ok: false, errors: user.errors.full_messages }, status: 422
      end
    end

    def resend
      email = params[:email].to_s
      user = User.send_confirmation_instructions(email: email)

      if user.errors.empty?
        render json: { ok: true }, status: 200
      else
        render json: { ok: false, errors: user.errors.full_messages }, status: 422
      end
    end
  end
end
