ActiveRecord::Schema.define do

  create_table "jobs", :force => true do |t|
    t.column "label", :string
    t.column "salary", :integer
  end

  create_table "people", :force => true do |t|
    t.column "name", :string
  end

end