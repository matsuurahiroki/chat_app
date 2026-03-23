# spec/spec_helper.rb
RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  # ↑expect()を使うときの設定、例外処理の時のメッセを詳細にする、expect()自体はif構文みたいなもの？

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  # ↑テストに関する設定

  config.shared_context_metadata_behavior = :apply_to_host_groups
end
