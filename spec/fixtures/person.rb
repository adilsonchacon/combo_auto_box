class Person < ActiveRecord::Base
  has_combo_auto_box({ term: 'name' })
end