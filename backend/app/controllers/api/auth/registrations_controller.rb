# frozen_string_literal: true

module Api
  module Auth
    class RegistrationsController < ApplicationController
      protect_from_forgery with: :null_session

      def create
        email = params[:email] || params.dig(:registration, :email)

        if email.blank?
          render json: { error: 'missing_email' }, status: :unprocessable_entity
          return
        end

        if params[:name].blank?
          render json: { error: 'missing_name' }, status: :unprocessable_entity
          return
        end

        if params[:password].blank?
          render json: { error: 'missing_password' }, status: :unprocessable_entity
          return
        end

        if User.exists?(email:)
          render json: { error: 'email_duplication' }, status: :conflict
          return
        end

        user = User.new(
          name: params[:name],
          email: email,
          password: params[:password]
        )

        if user.save
          render json: {
            id: user.id,
            email: user.email,
            name: user.name
          }, status: :ok
        else
          render json: {
            error: 'validation_error',
            error_codes: build_error_codes(user)
          }, status: :unprocessable_entity
        end
      end

      private

      def build_error_codes(user)
        codes = user.errors.details.flat_map do |field, details|
          details.map do |detail|
            case [field, detail[:error]]
            when %i[name blank]
              'missing_name'
            when %i[email blank]
              'missing_email'
            when %i[email taken]
              'email_duplication'
            when %i[email invalid]
              'invalid_email_format'
            when %i[password blank]
              'missing_password'
            when %i[password too_short]
              'password_too_short'
            when %i[password complexity_invalid]
              'password_complexity_invalid'
            end
          end
        end.uniq

        # 複数条件を最優先
        return ['password_invalid_multiple'] if codes.include?('password_too_short') && codes.include?('password_complexity_invalid')

        codes
      end
    end
  end
end
