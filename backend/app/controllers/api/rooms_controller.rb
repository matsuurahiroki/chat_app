# frozen_string_literal: true

# app/controllers/api/rooms_controller.rb

module Api
  class RoomsController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :verify_bff_token!

    def index
      rooms = Room.includes(:user).order(created_at: :desc)
      render json: rooms.as_json(
        only: %i[id title user_id created_at],
        methods: %i[created_at_text],
        include: {
          user: {
            only: %i[id name]
          }
        }
      )
    end

    def create
      # 1. user_id からユーザーを特定
      user = User.find_by(id: params[:user_id])
      return render json: { error: 'user_not_found' }, status: :not_found unless user

      # 2. そのユーザーに紐づくルームを作成
      room = user.rooms.build(title: params[:title])

      # 3. 保存できたら 201 / ダメなら 422
      if room.save
        render json: room.as_json(only: %i[id title user_id created_at]),
               status: :created
      else
        render json: { error: room.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    def show
      room = Room.includes(:user).find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found unless room

      render json: room.as_json(
        only: %i[id title user_id created_at],
        methods: %i[created_at_text],
        include: {
          user: {
            only: %i[id name]
          }
        }
      )
    end

    def destroy
      room = Room.find(params[:id])

      # :シンボル名はハッシュのキーのようなもの
      # キーワード引数:はあらかじめ決まった名前の引数を渡すもの
      # Room.find(params[:id])とRoom.find_by(id: params[:id])の違いは例外時の挙動、前者はその時点で例外が発生、後者はnilを返す

      requester_id = request.headers['X-User-Id'].to_i
      return render json: { error: 'missing_user_id' }, status: :unauthorized if requester_id <= 0 || requester_id.nil?

      if room.user_id != requester_id
        render json: { error: 'forbidden' }, status: :forbidden
        return
      end

      room.destroy
      render json: { ok: true }, status: :ok
    end

    private

    def verify_bff_token!
      expected = ENV['BFF_SHARED_TOKEN'].to_s
      provided = request.headers['X-BFF-Token'].to_s
      head :unauthorized unless expected.present? &&
                                ActiveSupport::SecurityUtils.secure_compare(expected, provided)
    end
  end
end
