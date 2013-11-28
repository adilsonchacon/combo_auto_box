$:.push File.expand_path("../lib", __FILE__)
require 'combo_auto_box/version'

Gem::Specification.new do |s|
  s.name = "combo_auto_box"
  s.version = ComboAutoBox::VERSION
  s.platform = Gem::Platform::RUBY
  s.licenses = ['MIT', 'GPL-2']
  s.authors = ["Adilson Chacon"]
  s.email = ["adilsonchacon@gmail.com"]
  s.homepage = %q{https://github.com/adilsonchacon/combo_auto_box}
  s.summary = "Text Field Autocomplete To Replace Comboboxes"
  s.description = "Text Field Autocomplete To Replace Comboboxes."
  s.date = Time.now

  s.files = Dir["{lib,vendor}/**/*"]
  s.test_files = `git ls-files -- spec/`.split("\n") + `git ls-files -- test/`.split("\n")
  s.require_paths = ["lib"]

  # if RUBY_VERSION.to_f >= 2.0
  #   s.add_dependency("activesupport", ["~> 4.0.0"])
  #   s.add_dependency("activerecord", ["~> 4.0.0"])
  # 
  #   s.add_development_dependency "rails", ["~> 4.0.0"]
  # else
  #   s.add_dependency("activesupport", ["~> 3.2"])
  #   s.add_dependency("activerecord", ["~> 3.2"])
  # 
  #   s.add_development_dependency "rails", ["~> 3.2"]
  # end

  s.add_development_dependency "rspec"
end
