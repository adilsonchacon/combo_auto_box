module ComboAutoBox # :nodoc:
end

require File.join(File.dirname(__FILE__), 'combo_auto_box', 'version')

require File.join(File.dirname(__FILE__), 'combo_auto_box', 'engine')

if defined? Rails::Railtie
  require File.join(File.dirname(__FILE__), 'combo_auto_box', 'railtie')
elsif defined? Rails::Initializer
  $stderr.puts "\nCombo Auto Box is not compatible with Rails 2, use at your own risk.\n\n"
end