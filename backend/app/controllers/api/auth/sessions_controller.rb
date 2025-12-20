# frozen_string_literal: true

module Api
  module Auth
    class SessionsController < ApplicationController
      protect_from_forgery with: :null_session

      def create
        email = params[:email] || params.dig(:session, :email)
        password = params[:password] || params.dig(:session, :password)

        if email.blank? || password.blank?
          render json: { error: 'missing_params' }, status: :bad_request
          return
        end

        user = User.find_by(email:)

        unless user&.valid_password?(password)
          render json: { error: 'invalid_credentials' }, status: :unauthorized
          return
        end

        # ：id / email / name を返す
        render json: {
          id: user.id,
          email: user.email,
          name: user.name
        }, status: :ok
      end

      def destroy
        head :no_content
      end
    end
  end
end
