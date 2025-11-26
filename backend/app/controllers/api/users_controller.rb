# frozen_string_literal: true

# app/controllers/api/users_controller.rb
module Api
  class UsersController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :verify_bff_token!

    def update
      Rails.logger.debug "[Users#update] params = #{params.inspect}"
      user = User.find_by(id: params[:id])
      unless user
        Rails.logger.debug "[Users#update] user not found id=#{params[:id]}"
        return render json: { error: 'not_found' }, status: :not_found
      end

      if user.update(user_params)
        Rails.logger.debug '[Users#update] update OK'
        render json: {
          id: user.id,
          email: user.email,
          name: user.name
        }, status: :ok
      else
        Rails.logger.debug "[Users#update] validation error #{user.errors.full_messages}"
        render json: { error: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      user = current_user
      if user.nil?
        uid = request.headers['X-User-Id'].to_s
        return head :bad_request if uid.blank?

        user = User.find_by(id: uid)
      end
      return head :not_found unless user

      user.destroy!
      reset_session
      head :no_content
    end

    private

    def user_params
      params.permit(:name, :email) # ← これが user_params
    end

    def verify_bff_token!
      expected = ENV['BFF_SHARED_TOKEN'].to_s
      provided = request.headers['X-BFF-Token'].to_s
      head :unauthorized unless expected.present? &&
                                ActiveSupport::SecurityUtils.secure_compare(expected, provided)
    end
  end
end
