# frozen_string_literal: true

# app/controllers/api/messages_controller.rb

module Api
  class MessagesController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :verify_bff_token!

    before_action :set_room, only: %i[index create show update destroy]
    before_action :set_message, only: %i[show update destroy]

    def index
      messages = @room.messages.includes(:user).order(created_at: :asc)

      render json: messages.as_json(
        only: %i[id body room_id user_id created_at edited_at],
        include: { user: { only: %i[id name] } }
      )
    end

    def create
      user = User.find_by(id: params[:user_id])
      return render json: { error: 'unauthorized' }, status: :unauthorized unless user

      body = params[:body].to_s
      return render json: { error: 'missing_body' }, status: :bad_request if body.strip.empty?

      message = @room.messages.build(body: body, user: user)

      if message.save
        render json: message.as_json(
          only: %i[id body room_id user_id created_at edited_at],
          include: { user: { only: %i[id name] } }
        ), status: :created
      else
        render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def show
      render json: @message.as_json(
        only: %i[id body room_id user_id created_at edited_at],
        include: { user: { only: %i[id name] } }
      )
    end

    def update
      user = User.find_by(id: request.headers['X-User-Id'])
      return render json: { error: 'unauthorized' }, status: :unauthorized unless user

      room = Room.find_by(id: params[:room_id])
      return render json: { error: 'not_found' }, status: :not_found unless room

      message = room.messages.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found unless message
      return render json: { error: 'forbidden' }, status: :forbidden unless message.user_id == user.id

      body = params[:body].to_s.strip
      return render json: { error: 'missing_body' }, status: :bad_request if body.strip.empty?

      return render json: { error: 'edit_window_expired' }, status: :forbidden if message.created_at < 1.hour.ago

      # params[:body] は「送られてきた本文」
      # .to_s は数値を文字列化するためだが、このニュアンスは nil ガード（nil の場合は空文字列に変換）

      if message.update(body: body, edited_at: Time.current)
        render json: message.as_json(
          only: %i[id body room_id user_id created_at edited_at],
          include: { user: { only: %i[id name] } }
        )
      else
        render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      user = User.find_by(id: request.headers['X-User-Id'])
      return render json: { error: 'unauthorized' }, status: :unauthorized unless user

      room = Room.find_by(id: params[:room_id])
      return render json: { error: 'not_found' }, status: :not_found unless room

      message = room.messages.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found unless message
      return render json: { error: 'forbidden' }, status: :forbidden unless message.user_id == user.id

      if message.destroy
        head :no_content
      else
        render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_room
      @room = Room.find_by(id: params[:room_id])
      return if @room

      render json: { error: 'room_not_found' }, status: :not_found
    end

    def set_message
      @message = @room.messages.find_by(id: params[:id])
      return if @message

      render json: { error: 'message_not_found' }, status: :not_found
    end

    def verify_bff_token!
      expected = ENV['BFF_SHARED_TOKEN'].to_s
      provided = request.headers['X-BFF-Token'].to_s
      head :unauthorized unless expected.present? && ActiveSupport::SecurityUtils.secure_compare(expected, provided)
    end
  end
end

# as_json が「Rubyオブジェクト → Hash/Array」に変換する
# render json:が「RubyのArray/Hash → JSON文字列」にしてHTTPレスポンスにする
# @変数はインスタンス変数、メソッドをまたぐ時、同じオブジェクト内で共有したい時に使う
