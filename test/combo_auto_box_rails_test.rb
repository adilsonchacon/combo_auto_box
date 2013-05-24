require  File.expand_path('test_helper', File.dirname(__FILE__))

class ComboAutoBoxRailsTest < ActionDispatch::IntegrationTest
  test 'can access combo auto box javascript' do
    get '/assets/combo-auto-box.js'
    assert_response :success
  end

  test 'can access combo auto box stylesheets' do
    get '/assets/combo-auto-box.css'
    assert_response :success
  end

  test 'can access combo auto box images' do
    get '/assets/combo_auto_box_expand.png'
    assert_response :success
  end
end