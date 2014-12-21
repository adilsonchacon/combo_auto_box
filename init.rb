require File.join(File.dirname(__FILE__), 'lib', 'combo_auto_box')

if defined? ActiveRecord::Base
  require File.join(File.dirname(__FILE__), 'lib', 'combo_auto_box', 'active_record')
end