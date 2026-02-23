# db/seeds.rb

return if Rails.env.test?

guest1 = User.find_or_create_by!(email: 'guest1@example.com') do |u|
  u.name = 'Guest1'
  u.password = 'password1234'
  u.password_confirmation = 'password1234'
end

guest2 = User.find_or_create_by!(email: 'guest2@example.com') do |u|
  u.name = 'Guest2'
  u.password = 'password1234'
  u.password_confirmation = 'password1234'
end

# 既に作られていて confirmed_at が nil の場合もあるので補正
guest1.update!(confirmed_at: Time.current) if guest1.respond_to?(:confirmed_at) && guest1.confirmed_at.nil?

rooms = 5.times.map do |i|
  Room.find_or_create_by!(title: "Sample Room #{i + 1}", user: guest1)
end

rooms.each do |room|
  3.times do |j|
    Message.find_or_create_by!(
      room: room,
      user: guest1,
      body: "サンプルメッセージ #{j + 1}",
      edited_at: j == 2 ? Time.current : nil
    )

    Message.find_or_create_by!(
      room: room,
      user: guest2,
      body: "サンプルメッセージ #{j + 1}",
      edited_at: j == 2 ? Time.current : nil
    )
  end
end
