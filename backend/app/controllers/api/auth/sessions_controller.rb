# frozen_string_literal: true

module Api
  module Auth
    class SessionsController < ApplicationController
      protect_from_forgery with: :null_session

      def create
        user = User.find_by(email: params[:email])

        return render(json: { error: 'invalid_credentials' }, status: :unauthorized) unless user&.valid_password?(params[:password])

        render json: { user_id: user.id }, status: :ok
      end

      def destroy
        head :no_content
      end
    end
  end
end
