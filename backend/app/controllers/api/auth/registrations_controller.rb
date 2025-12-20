# frozen_string_literal: true

module Api
  module Auth
    class RegistrationsController < ApplicationController
      protect_from_forgery with: :null_session

      def create
        user = User.new(
          name: params[:name],
          email: params[:email],
          password: params[:password] # ← Devise が encrypted_password に変換
        )

        if user.save
          render json: {
            id: user.id,
            email: user.email,
            name: user.name
          }, status: :ok
        else
          render json: {
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end
end
