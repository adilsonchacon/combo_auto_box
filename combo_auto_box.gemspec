$:.push File.expand_path("../lib", __FILE__)
require 'combo_auto_box/version'

Gem::Specification.new do |s|
  s.name = "combo_auto_box"
  s.version = ComboAutoBox::VERSION
  s.platform = Gem::Platform::RUBY
  s.authors = ["Adilson Chacon"]
  s.email = ["adilsonchacon@gmail.com"]
  s.homepage = %q{https://github.com/adilsonchacon/combo_auto_box}
  s.summary = "Text Field Autocomplete To Replace Comboboxes"
  s.description = "Text Field Autocomplete To Replace Comboboxes."
  s.date = Time.now

  s.files = Dir["{lib,vendor}/**/*"]
  s.test_files = `git ls-files -- spec/`.split("\n")
  s.require_paths = ["lib"]

  s.add_dependency("activesupport", ["~> 3.2"])
  s.add_dependency("activerecord", ["~> 3.2"])

  s.add_development_dependency "rails", ["~> 3.2"]
  s.add_development_dependency "rspec"
end
