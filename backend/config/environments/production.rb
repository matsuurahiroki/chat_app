# frozen_string_literal: true

# config/environments/production.rb

require 'active_support/core_ext/integer/time'

Rails.application.configure do
  config.enable_reloading = false

  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true

  config.active_storage.service = :local

  config.assume_ssl = true

  config.ssl_options = {
    redirect: {
      exclude: ->(req) { req.path.start_with?('/health') }
    }
  }

  config.force_ssl = true

  config.logger = ActiveSupport::Logger.new($stdout)
                                       .tap  { |logger| logger.formatter = Logger::Formatter.new }
                                       .then { |logger| ActiveSupport::TaggedLogging.new(logger) }

  # Prepend all log lines with the following tags.
  config.log_tags = [:request_id]

  config.log_level = ENV.fetch('RAILS_LOG_LEVEL', 'info')

  config.action_mailer.perform_caching = false

  config.i18n.fallbacks = true

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Only use :id for inspections in production.
  config.active_record.attributes_for_inspect = [:id]
end
