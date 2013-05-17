require 'rake'
gem 'rdoc'
require 'rdoc/task'
require 'rspec/core/rake_task'

require 'bundler'
Bundler::GemHelper.install_tasks

desc 'Generate documentation.'
RDoc::Task.new do |rdoc|
  rdoc.main = "README.md"
  rdoc.rdoc_files.include("README.md","lib/**/*.rb")
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'ComboAutoBox'
  rdoc.options << '--line-numbers' << '--inline-source'
end

task :default => :spec

desc 'Run specs'
RSpec::Core::RakeTask.new(:spec) do |t|
  t.pattern = 'spec/**/*_spec.rb'
  t.ruby_opts = "-Ilib:spec"
end

namespace :spec do
  desc "Run Rails specs"
  RSpec::Core::RakeTask.new(:rails) do |t|
    t.pattern = %w'spec/finders/active_record_spec.rb'
  end
end