# frozen_string_literal: true

# app/controllers/api/auth/social/google_logins_controller.rb
module Api
  module Auth
    module Social
      class GoogleLoginsController < ApplicationController
        skip_before_action :verify_authenticity_token
        def create
          # 仮のレスポンス（ここにGoogleログイン処理を書く）
          render json: { message: 'Google login successful' }, status: :ok
        end
      end
    end
  end
end
