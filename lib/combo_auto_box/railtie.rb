require File.join(File.dirname(__FILE__), '..', 'combo_auto_box')

module ComboAutoBox
  class Railtie < Rails::Railtie
    initializer "combo_auto_box" do
      ActiveSupport.on_load :active_record do
        require 'combo_auto_box/active_record'
      end
    end
  end
end
 