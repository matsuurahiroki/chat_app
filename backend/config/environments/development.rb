# frozen_string_literal: true

# 時間系のヘルパー（2.days など）を使うため
require 'active_support/core_ext/integer/time'

Rails.application.configure do
  # 開発中はコード変更を自動反映する
  config.enable_reloading = true

  # 開発環境では eager load しない
  config.eager_load = false

  # エラー画面を詳しく表示する
  config.consider_all_requests_local = true

  # ブラウザの開発ツール向けに Server-Timing ヘッダを付ける
  config.server_timing = true

  # tmp/caching-dev.txt がある時だけキャッシュを有効にする
  if Rails.root.join('tmp/caching-dev.txt').exist?
    # Controller のキャッシュを有効化
    config.action_controller.perform_caching = true

    # フラグメントキャッシュのログも出す
    config.action_controller.enable_fragment_cache_logging = true

    # 開発環境ではメモリキャッシュを使う
    config.cache_store = :memory_store

    # public 配下の静的ファイルに Cache-Control を付ける
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    # キャッシュ無効
    config.action_controller.perform_caching = false

    # キャッシュストアも無効
    config.cache_store = :null_store
  end

  # Active Storage はローカル保存
  config.active_storage.service = :local

  config.action_mailer.perform_deliveries = false

  # メール送信まわりのキャッシュはしない
  config.action_mailer.perform_caching = false

  # 非推奨警告はログに出す
  config.active_support.deprecation = :log

  # 許可していない非推奨警告は例外にする
  config.active_support.disallowed_deprecation = :raise

  # 特別に許可する非推奨警告の一覧（今は空）
  config.active_support.disallowed_deprecation_warnings = []

  # 未実行 migration があればページ表示時にエラーにする
  config.active_record.migration_error = :page_load

  # SQL ログに呼び出し元行も出して見やすくする
  config.active_record.verbose_query_logs = true

  # Active Job の enqueue ログを詳しく出す
  config.active_job.verbose_enqueue_logs = true

  # 存在しない callback action を指定したら例外にする
  config.action_controller.raise_on_missing_callback_actions = true

  # 開発中は SQL や処理の詳細を見たいので debug
  config.log_level = :debug

  # 開発中はホスト制限を外す
  config.hosts.clear
end
