# frozen_string_literal: true

# app/controllers/api/auth/sessions_controller.rb

module Api
  module Auth
    class SessionsController < ApplicationController
      protect_from_forgery with: :null_session

      def create
        email = params[:email] || params.dig(:session, :email)
        password = params[:password] || params.dig(:session, :password)
        # params.digは入れ子（ネスト）の中の値を読み取る(session: { email: ..., password: ... })を読み取られるようになる

        if email.blank? || password.blank? # blank?は空文字/空白/nilをチェックする
          render json: { error: 'missing_params' }, status: :bad_request
          return
        end

        user = User.find_by(email:)

        unless user&.valid_password?(password)
          # user何ある且つ、valid_password?でぱすわーどが正しいか確認
          render json: { error: 'invalid_credentials' }, status: :unauthorized
          return
        end

        # unless user.confirmed?
        #   render json: { error: 'email_not_confirmed' }, status: :forbidden
        #   return
        # end

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
