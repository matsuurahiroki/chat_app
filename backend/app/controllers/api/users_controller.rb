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

    def update_password
      user = User.find_by(id: params[:user_id])

      if user.nil?
        render json: { error: 'user_not_found' }, status: :not_found
        return
      end

      unless user.valid_password?(params[:current_password])
        render json: { error: 'current_password_is_invalid' }, status: :unauthorized
        return
      end

      if user.update_with_password(
        current_password: params[:current_password],
        password: params[:password],
        password_confirmation: params[:password_confirmation]
      )
        render json: { message: 'password_updated' }, status: :ok
      else
        render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    end

    def destroy
      user = current_user

      if user.nil?
        user_id = request.headers['X-User-Id'].to_s
        return render json: { error: 'user_id_missing' }, status: :bad_request if user_id.blank?

        user = User.find_by(id: user_id)
      end

      if user.nil?
        render json: { error: 'user_not_found' }, status: :not_found
        return
      end

      current_password = params[:current_password].to_s

      if current_password.blank?
        render json: { error: 'missing_current_password' }, status: :bad_request
        return
      end

      unless user.valid_password?(current_password)
        render json: { error: 'current_password_is_invalid' }, status: :unauthorized
        return
      end

      user.destroy!
      reset_session

      render json: { message: 'account_deleted' }, status: :ok
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
